from ast import While
from urllib.parse import urlparse
import requests
import json
import os
import webbrowser
import time
import psutil
import pywinauto
from bs4 import BeautifulSoup

waitTime = 60 # interval between checks in seconds

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36"}


def waitIfRunning():
    name = "webexmta.exe"
    if(name in (p.name() for p in psutil.process_iter())):
        print("Already running")
        print("Stop Recording when meeting ends")
        webex = pywinauto.Application(backend='win32').connect(
            title='Webex', class_name="CiscoUIFrame")
        while(True):
            try:
                webex.wait_for_process_exit(timeout=None)
                break
            except:
                print("Running")
        print("Meeting ended")
        time.sleep(10)


def getLink(link):
    while(True):
        try:
            print("getting url")
            r = requests.get(link, headers=headers)
            print("got url")
            break
        except:
            print("no response")
    link = r.url.replace("wbxmjs/joinservice",
                         "webappng")
    return link


def checker(link):
    link = getLink(link).replace("download", "info")
    apiURL = link.replace("sites/iiitn/meeting/info", "api/v1/meetings")
    print(apiURL)
    # To execute get request
    while(True):
        try:
            print("getting data")
            response = requests.get(apiURL, headers=headers)
            print("got data")
            break
        except:
            print("no response")
    if(response.status_code != 200):
        print(response.status_code)
        return False
    try:
        print("reading json")
        resp = json.loads(response.text)
        print("read json")
    except:
        print("Error in json")
        return False
    if "meetingOccurrenceStatus" in resp or "meetingStarted" in resp:
        if (("meetingStarted" in resp and resp["meetingStarted"]) or ("meetingOccurrenceStatus" in resp and resp["meetingOccurrenceStatus"]["inProgress"])):
            print("Host : " + resp["hostDisplayName"])
            return True
    return False


def joiner(link):
    print("Joining meeting")
    print(link)
    link = getLink(link)
    meetingURL = link.replace("info", "download")
    while(True):
        try:
            print("getting meeting info")
            html = requests.get(meetingURL, headers=headers)
            print("got meeting info")
            break
        except:
            print("no response")
    parsed_html = BeautifulSoup(html.text, features="html.parser")
    extendedData = json.loads(parsed_html.body.find(
        'script', attrs={'id': 'extendedData'}).text)
    webbrowser.open(extendedData["simpleflowMapping"]["urlProtocollink"])


def main():
    try:
        my_file = open("links.txt", "r")
    except:
        print("No links.txt file found")
        print("Create a links.txt file with links of meetings")
        exit()
    content_list = my_file.readlines()
    my_file.close()
    content_list = [x.strip() for x in content_list]
    content_list = [x.split(" ")[0] for x in content_list]
    links = content_list
    while(True):
        waitIfRunning()
        for link in links:
            if checker(link):
                print("Meeting is in progress : " + link)
                joiner(link)
            else:
                print("Meeting is not in progress : " + link)
            print("\n")
        print("Waiting...")
        time.sleep(waitTime)


if __name__ == "__main__":
    main()
