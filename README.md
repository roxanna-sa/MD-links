# Markdown Links

## Index

* [1. Preface](#1-preface)
* [2. Summary](#2-summary)
* [3. User](#3-user)
* [4. Flowchart](#4-flowchart)
* [5. Use as a Javascript API](#5-use-as-a-javascript-api)
* [6. Use as a Command Line Interface](#6-use-as-a-command-line-interface)
* [7. Used libraries](#7-used-libraries)
* [8. Usability testing on different operating systems](#8-usability-testing-on-different-operating-systems)
* [9. Unit tests using Jest ](#9-unit-test-using-Jest)
* [10. Download](#10-download)

***

## 1. Preface

[Markdown](https://es.wikipedia.org/wiki/Markdown) is a lightweight and straightforward markup language designed for easy and readable text formatting, with the purpose of converting it to HTML or other formats. It is commonly used by developers, writers, bloggers, designers, and anyone who wants to create content online.
You can find this language used in various online platforms, text editors, and content management systems, including GitHub, Reddit, Stack Overflow, Jupyter Notebook, and many others.

## 2. Summary

This project is a command-line tool (CLI) as well as a library that runs using [Node.js](https://nodejs.org/). 

Node.js is a runtime environment for JavaScript built with Chrome's V8 JavaScript engine. This allows us to execute JavaScript in the operating system's environment, whether it's your local machine or a server, which opens up the possibility to interact with the system itself, files, networks, and more.

## 3. User

A Node.js library used to identify valid or broken links in Markdown files could be useful for various individuals and groups:

* Web developers and bloggers: They can use this library to verify the integrity of links on their websites, blogs, or documentation written in Markdown. This helps them keep their content up-to-date and ensures that links are functioning correctly.

* Open-source project maintainers: When managing the documentation of an open-source project in Markdown, they can utilize this library to ensure that links to external resources or other parts of the repository are active and working.

* Technical documentation teams: Teams responsible for maintaining technical documentation in Markdown can use this library to automate link checking and facilitate the task of keeping documentation up-to-date and accurate.

* Editors and writers: Those who work with Markdown to write articles, e-books, or any type of online content can benefit from detecting and correcting broken links in their texts before publishing.

* Website administrators: Those in charge of managing large or complex websites can use this library to perform periodic audits and ensure that all links are active and functioning, thus avoiding user experience and SEO issues.

Summarizing, anyone using Markdown files and wishing to keep track of valid or broken links in their content could find this Node.js library useful.


## 4. Flowchart

Flowchart used for the project development.

<img src='./Readme img/flowchart.png'>


## 5. Use as a Javascript API


## 6. Use as a Command Line Interface

<img src='./Readme%20img/noRoute.png'>

<img src='./Readme%20img/pathNoExist.png'>

<img src='./Readme%20img/onlyARoute.png'>

<img src='./Readme%20img/routeAndStats.png'>

<img src='./Readme%20img/routeAndValidate.png'>

<img src='./Readme%20img/statsAndValidate.png'>

## 7. Used libraries

* File system : This module is a built-in Node.js module that provides an API for interacting with the file system on the local machine. It allows developers to perform various file-related operations, such as reading from and writing to files, creating and deleting directories, and modifying file permissions.

* Axios : It is a popular JavaScript library used for making HTTP requests from both the browser and Node.js environments. It provides a simple and intuitive interface to perform HTTP calls, supporting features like Promise-based requests, request and response interception, automatic JSON data transformation, and handling request cancellation.

* Chalk : A Node.js library used for styling terminal text with colors and styles. It allows to apply different text colors, background colors, and text styles (e.g., bold, italic) to enhance the readability and presentation of output in the terminal or command-line interface.

* Figlet : JavaScript library that converts text into stylized ASCII art. It takes a string of characters as input and generates a larger version of the text using various ASCII characters and symbols, creating an artistic representation of the input text. It is often used to add a decorative touch to command-line interfaces and console applications.


## 8. Usability testing on different operating systems


## 9. Unit tests using Jest

<img src='./Readme%20img/testingMdLinks.png'>

## 10. Download

