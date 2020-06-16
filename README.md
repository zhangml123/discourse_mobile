# forum-mobile ( forum width android / IOS platform )


##### 一、android 平台安装
##### 1、安装依赖
###### 必须安装的依赖有：Node、Python2、JDK 和 Android Studio。(注意 Node 的版本应大于等于 12，Python 的版本必须为 2.x（不支持 3.x），而 JDK 的版本必须是 1.8（目前不支持 1.9 及更高版本，注意 1.8 版本官方也直接称 8 版本）)

##### 2、安装项目
```
$ git clone https://github.com/PlatONnetwork/forum-mobile.git
$ cd forum-mobile 
$ npm install
```
##### 3、启动项目
```
$ react-native run-android
```


##### 二、IOS 平台安装
##### 1、安装依赖
###### 必须安装的依赖有：Node、Watchman、Xcode 和 CocoaPods。（需要Xcode 10 或更高版本）

##### 2、安装项目
```
$ git clone https://github.com/PlatONnetwork/forum-mobile.git
$ cd forum-mobile
$ npm install
$ cd ios && pod install 
```
##### 3、启动项目
```
$ react-native run-ios
```
