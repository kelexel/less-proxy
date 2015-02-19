# less-proxy

v0.0.1

## About

I needed a fast way, a really fast way, to inject custom CSS attributes in pre-defined .less files, and have the result cached to disk.

But I couldn't find a tool that would let me do it as as I wanted to.

I wanted something simple, give it a template name, some attributes, and a destination file name.

Than I realized I wanted to abstract it from my current project, and make it a general-purpose "less-proxy"

Thus, less-proxy was born.

## Disclaimer

Some things are probably done in a very simplistic way, so please, fork it, and make pull requests

Of course I can't be held responsible for whatever you'll end up doing using this tool

## Install

```js
git clone project_git_url
cd less-proxy
npm install
```

## Usage

less-proxy is based on top of express, so just start the server as you would start any express app, ie:
```shell
DEBUG=bewi_css_preprocessor:* ./bin/www
```
Note: Have a look at the ./etc/env.js to configure the allowed templates list and the cached file directory for the "On Demand" mode

## API

### Two is better than one

less-proxy can work in two ways:

#### On demand
Make a POST request, containing a template name, destination file name, and an object containing the variables you want to set as globalVars or modifyVars, less-proxy will evaluate the template name against a predetermined list of files, load it, parse it with your variables object, and save the result to a cache folder under the destination file set you chose.

The POST request must be made to http://localhost:3000/proxy (or whatever you set as environment variable)

The POST data must contain three variables:
* template: name of the .less template file to use, and located under ./templates, ie: "example.lss"
* destination: name of final processed file, ie: "example.css"
* variables: a JSON encoded object containing key/value pairs, ie: {"myAwesomeVar": "blue"}

In case of success, less-proxy will return a JSON object like: {"status": "success", "file": "example.css"}

#### Streaming
Make a POST request, containing the content of a CSS file, and an object containing the variables you want to set as globalVars or modifyVars, less-proxy will parse your providen CSS stringified file with your variables object, and stream the result back to you.

The POST request must be made to http://localhost:3000/proxy (or whatever you set as environment variable)

The POST data must contain two variables:
* css: a css string, or stringified css file
* variables: a JSON encoded object containing key/value pairs, ie: {"myAwesomeVar": "blue"}

In case of success, less-proxy will stream back the processed and compiled CSS file
