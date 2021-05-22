# **PerunBot**

##  **Using nodejs only**

### run

> ``node . --config=$CONFIG_FILE_NAME``

___
## **Using docker**

### compile/build

> ``docker build -t perun:bot .``

___

### run

> ``docker run -e config='$CONFIG_FILE_NAME' perun:bot``

___
## env

``$CONFIG_FILE_NAME`` - file name with config(prefered file names: config.json or config_dev,json), **default**: ``config.json``