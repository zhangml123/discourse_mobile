package com.discoursemobile.module;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;

import com.discoursemobile.RichEditorActivity;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.JSApplicationIllegalArgumentException;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import org.json.JSONObject;

public class MapIntentModule extends ReactContextBaseJavaModule{
    private ReactContext mReactContext;
    public static Callback startActivityByClassnameCallback;
    public MapIntentModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mReactContext = reactContext;
    }
    @Override
    public String getName() {
        return "MapIntentModule";
    }



    @ReactMethod
    public void startActivityByClassname(String params, Callback callback){
        startActivityByClassnameCallback = callback;
        try{
            JSONObject obj = new JSONObject(params);
            System.out.println("MapIntentModule1111111" + obj);
            System.out.println(obj);
            Activity currentActivity = getCurrentActivity();
            Class aimActivity = Class.forName( obj.getString("activity"));
            if(null!=currentActivity && !currentActivity.getClass().equals(aimActivity)){
                Intent intent = new Intent(currentActivity,aimActivity);
                intent.putExtra("args", obj.getString("args"));
                currentActivity.startActivity(intent);
            }

        }catch(Exception e){
            throw new JSApplicationIllegalArgumentException(
                    "error: "+e.getMessage());
        }
    }
    @ReactMethod
    public void finishActivity(){
        try{
            Activity currentActivity = getCurrentActivity();
            if(null!=currentActivity){
                currentActivity.finish();
            }
        }catch(Exception e){
            throw new JSApplicationIllegalArgumentException(
                    "error: "+e.getMessage());
        }
    }

    @ReactMethod
    public void postMessenger(String postMassage, Callback callback){
        try{
            JSONObject obj = new JSONObject(postMassage);
            RichEditorActivity.postMessenger(obj);
        }catch(Exception e){
            throw new JSApplicationIllegalArgumentException(
                    "error: "+e.getMessage());
        }
    }
}