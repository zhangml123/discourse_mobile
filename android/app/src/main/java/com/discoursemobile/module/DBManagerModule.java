package com.discoursemobile.module;

import com.discoursemobile.manager.DBManager;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import org.json.JSONArray;

public class DBManagerModule extends ReactContextBaseJavaModule {

    private ReactContext mReactContext;

    public DBManagerModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mReactContext = reactContext;
    }

    @Override
    public String getName() {
        return "DBManagerModule";
    }

    @ReactMethod
    public void setUser(String username, String name, String avatar_template, String csrf, Callback callback) {
        DBManager dbManager = new DBManager(mReactContext);
        int rs = dbManager.setUser(username, name, avatar_template, csrf);
        callback.invoke(rs);
    }
    @ReactMethod
    public void getUser(Callback callback) {
        DBManager dbManager = new DBManager(mReactContext);
        JSONArray arr = dbManager.getUser();
        callback.invoke(arr.toString());
    }
    @ReactMethod
    public void deleteUser(Callback callback) {
        DBManager dbManager = new DBManager(mReactContext);
        int rs= dbManager.deleteUser();
        callback.invoke(rs);
    }


}