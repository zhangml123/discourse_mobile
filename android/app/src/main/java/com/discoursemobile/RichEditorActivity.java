package com.discoursemobile;
import android.Manifest;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;

import android.graphics.Color;

import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.AdapterView;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.Spinner;
import android.widget.TextView;

import androidx.annotation.NonNull;

import jp.wasabeef.richeditor.RichEditor;
import pub.devrel.easypermissions.EasyPermissions;

import com.discoursemobile.adapter.CategoriesAdapter;
import com.discoursemobile.module.MapIntentModule;
import com.facebook.react.ReactActivity;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.facebook.react.bridge.Arguments;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;


import java.util.List;

public class RichEditorActivity extends ReactActivity implements EasyPermissions.PermissionCallbacks, EasyPermissions.RationaleCallbacks{

    private RichEditor mEditor;
    private EditText mTitleEdt;
    private Button mSubmitBtn;
    private ProgressBar mProgress;
    //private TextView mPreview;
    private JSONArray categories;
    private Spinner spinner ;
    private LinearLayout statusLinear;
    private String currentCategoryId = "" ;
    private String title;
    private static TextView status;
    private static int POST_ERROR = 0;
    private static int POST_SUCCESS = 1;
    private static int UPLOAD_ERROR = 2;
    private static int UPLOAD_SUCCESS = 3;

    private static int GET_IMAGE = 1;
    private static Handler handler ;
    private ReactContext mReactContext;
    public static final int RC_CAMERA_AND_LOCATION = 1;
    private String[] perms = {Manifest.permission.READ_EXTERNAL_STORAGE,
            Manifest.permission.WRITE_EXTERNAL_STORAGE,
            Manifest.permission.CAMERA,
    };
    public static void postMessenger(JSONObject obj){
        try{

            System.out.println("obj22222222222222222 =");
            System.out.println(obj);
            Message msg = new Message();
            switch(obj.getString("type")) {
                case "post_error" :
                    msg.what = POST_ERROR;
                    msg.obj = obj.getString("msg");
                break;
                case "post_success" :
                    msg.what = POST_SUCCESS;
                    msg.obj = "success";
                    break;
                case "upload_error" :
                    msg.what = UPLOAD_ERROR;
                    msg.obj = obj.getString("msg");
                    break;
                case "upload_success" :
                    msg.what = UPLOAD_SUCCESS;
                    msg.obj = obj.getString("msg");
                    break;
            }

            handler.sendMessage(msg);
        }catch(JSONException e){
            System.out.println("error  =  "+e);
        }

    }
    private static void sendEvent(ReactContext reactContext, String eventName, WritableMap params)
    {
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName,params);
    }
    @SuppressLint("HandlerLeak")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_editor);
        mReactContext = this.getReactNativeHost().getReactInstanceManager().getCurrentReactContext();

        try{
           //String str = "[{'cateTittle':'Uncateeed'},{'cateTitle':'cate1'},{'cateTitle':'cate2'},{'cateTitle':'cate3'}]";
            //categories = new JSONArray(str);
            categories = new JSONArray(getIntent().getStringExtra("categories"));


        }catch(Exception e){
        }
        Bundle bundle= getIntent().getExtras();
        statusLinear = (LinearLayout) findViewById(R.id.status_Linear);
        status = (TextView) findViewById(R.id.status);
        spinner = (Spinner) findViewById(R.id.categories_spinner);
        CategoriesAdapter adapter = new CategoriesAdapter(this,categories);
        spinner.setAdapter(adapter);
        mProgress = (ProgressBar) findViewById(R.id.progress);
        mProgress.setVisibility(View.GONE);
        mTitleEdt = (EditText) findViewById(R.id.title_edt);
        mSubmitBtn = (Button) findViewById(R.id.submit_btn);
        mEditor = (RichEditor) findViewById(R.id.editor);

        //mEditor.setEditorHeight(200);
        mEditor.setEditorFontSize(16);
        //mEditor.setEditorFontColor(Color.RED);
        //mEditor.setEditorBackgroundColor(Color.BLUE);
        //mEditor.setBackgroundColor(Color.BLUE);
        //mEditor.setBackgroundResource(R.drawable.bg);
        mEditor.setPadding(10, 10, 10, 10);
        //mEditor.setBackground("https://raw.githubusercontent.com/wasabeef/art/master/chip.jpg");
        mEditor.setPlaceholder("Insert text here...");
        //mEditor.setInputEnabled(false);
        handler = new Handler() {
            @Override
            public void handleMessage(Message msg) {
                if (msg.what == POST_SUCCESS) {
                    finish();
                }
                if (msg.what == POST_ERROR) {
                    String errMsg = msg.obj.toString();
                    System.out.println(errMsg);
                    status.setText(errMsg);
                    status.setTextColor(Color.parseColor("#FF0000"));
                    statusLinear.setVisibility(View.VISIBLE);
                    mProgress.setVisibility(View.GONE);
                    mSubmitBtn.setEnabled(true);
                    mSubmitBtn.setBackgroundColor(Color.parseColor("#0088cc"));
                }
                if (msg.what == UPLOAD_ERROR){
                    String errMsg = msg.obj.toString();
                    status.setText(errMsg);
                }
                if (msg.what == UPLOAD_SUCCESS){

                    try {
                        JSONObject msg1 = new JSONObject(msg.obj.toString()) ;
                        String host = msg1.getString("host");
                        String path = msg1.getString("url");
                        String fileName = msg1.getString("original_filename");
                        String short_url = msg1.getString("short_url");
                        String width = msg1.getString("width");
                        String height = msg1.getString("height");
                        System.out.println("uploadimg host = " +host);
                        System.out.println("uploadimg path " +path);
                        System.out.println("uploadimg fileName = " +fileName);
                       // mEditor.insertImage(host + path,fileName);
                        //![1592205344574_img|102x88](upload://dRA4uhPAkJiA4ztcEbifWjuKHrb.png)
                        //![1592205344574_img.png|102x88](upload://dRA4uhPAkJiA4ztcEbifWjuKHrb.png)
                        String content = mEditor.getHtml();

                        System.out.println("RichEditorActivity1111 content1111111111111111111 = "+content);
                        if (content == null ) content = "";
                        String img=" !["+ fileName +"|"+width+"x"+height+"]("+short_url+") ";
                        System.out.println("uploadimg img = " +img);
                        mEditor.setHtml(content + img);
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }

            }
        };
        spinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @SuppressLint("WrongConstant")
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                try{
                    String cateTittle = categories.getJSONObject(position).getString("id");
                    System.out.println("onItemSelected1111 = "+title);
                    currentCategoryId = cateTittle;

                }catch(JSONException e){

                }
            }
            @Override
            public void onNothingSelected(AdapterView<?> parent) {
                // Another interface callback
            }
        });
        mTitleEdt.addTextChangedListener(new TextWatcher(){
            @Override
            public void onTextChanged(CharSequence text, int start, int before, int count) {
            }
            @Override
            public void beforeTextChanged(CharSequence text, int start, int count,int after) {
            }
            @Override
            public void afterTextChanged(Editable edit) {
                  }
        });
        mSubmitBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                String title = mTitleEdt.getText().toString();
                //currentCategoryId
                String content = mEditor.getHtml();
                System.out.println("content111111 = "+content);
                submit(title, content);

            }
        });
        //mPreview = (TextView) findViewById(R.id.preview);
       /*mEditor.setOnTextChangeListener(new RichEditor.OnTextChangeListener() {
            @Override public void onTextChange(String text) {
                mPreview.setText(text);
            }
        });
*/

        findViewById(R.id.action_back).setOnClickListener(new View.OnClickListener() {
            @Override public void onClick(View v) {
               finish();
            }
        });
        findViewById(R.id.cancel).setOnClickListener(new View.OnClickListener() {
            @Override public void onClick(View v) {
                finish();
            }
        });

 /*       findViewById(R.id.action_undo).setOnClickListener(new View.OnClickListener() {
            @Override public void onClick(View v) {
                mEditor.undo();
            }
        });

        findViewById(R.id.action_redo).setOnClickListener(new View.OnClickListener() {
            @Override public void onClick(View v) {
                mEditor.redo();
            }
        });
*/
        findViewById(R.id.action_bold).setOnClickListener(new View.OnClickListener() {
            @Override public void onClick(View v) {
                mEditor.setBold();
            }
        });

        findViewById(R.id.action_italic).setOnClickListener(new View.OnClickListener() {
            @Override public void onClick(View v) {
                mEditor.setItalic();
            }
        });
/*
        findViewById(R.id.action_subscript).setOnClickListener(new View.OnClickListener() {
            @Override public void onClick(View v) {
                mEditor.setSubscript();
            }
        });

        findViewById(R.id.action_superscript).setOnClickListener(new View.OnClickListener() {
            @Override public void onClick(View v) {
                mEditor.setSuperscript();
            }
        });

        findViewById(R.id.action_strikethrough).setOnClickListener(new View.OnClickListener() {
            @Override public void onClick(View v) {
                mEditor.setStrikeThrough();
            }
        });

        findViewById(R.id.action_underline).setOnClickListener(new View.OnClickListener() {
            @Override public void onClick(View v) {
                mEditor.setUnderline();
            }
        });
*/
/*       findViewById(R.id.action_heading1).setOnClickListener(new View.OnClickListener() {
            @Override public void onClick(View v) {
                mEditor.setHeading(1);
            }
        });

        findViewById(R.id.action_heading2).setOnClickListener(new View.OnClickListener() {
            @Override public void onClick(View v) {
                mEditor.setHeading(2);
            }
        });

        findViewById(R.id.action_heading3).setOnClickListener(new View.OnClickListener() {
            @Override public void onClick(View v) {
                mEditor.setHeading(3);
            }
        });

        findViewById(R.id.action_heading4).setOnClickListener(new View.OnClickListener() {
            @Override public void onClick(View v) {
                mEditor.setHeading(4);
            }
        });

        findViewById(R.id.action_heading5).setOnClickListener(new View.OnClickListener() {
            @Override public void onClick(View v) {
                mEditor.setHeading(5);
            }
        });

        findViewById(R.id.action_heading6).setOnClickListener(new View.OnClickListener() {
            @Override public void onClick(View v) {
                mEditor.setHeading(6);
            }
        });*/
/*
        findViewById(R.id.action_txt_color).setOnClickListener(new View.OnClickListener() {
            private boolean isChanged;

            @Override public void onClick(View v) {
                mEditor.setTextColor(isChanged ? Color.BLACK : Color.RED);
                isChanged = !isChanged;
            }
        });

        findViewById(R.id.action_bg_color).setOnClickListener(new View.OnClickListener() {
            private boolean isChanged;

            @Override public void onClick(View v) {
                mEditor.setTextBackgroundColor(isChanged ? Color.TRANSPARENT : Color.YELLOW);
                isChanged = !isChanged;
            }
        });

        findViewById(R.id.action_indent).setOnClickListener(new View.OnClickListener() {
            @Override public void onClick(View v) {
                mEditor.setIndent();
            }
        });

        findViewById(R.id.action_outdent).setOnClickListener(new View.OnClickListener() {
            @Override public void onClick(View v) {
                mEditor.setOutdent();
            }
        });
*/
   /*     findViewById(R.id.action_align_left).setOnClickListener(new View.OnClickListener() {
            @Override public void onClick(View v) {
                mEditor.setAlignLeft();
            }
        });

        findViewById(R.id.action_align_center).setOnClickListener(new View.OnClickListener() {
            @Override public void onClick(View v) {
                mEditor.setAlignCenter();
            }
        });

        findViewById(R.id.action_align_right).setOnClickListener(new View.OnClickListener() {
            @Override public void onClick(View v) {
                mEditor.setAlignRight();
            }
        });
*/
        findViewById(R.id.action_blockquote).setOnClickListener(new View.OnClickListener() {
            @Override public void onClick(View v) {
                mEditor.setBlockquote();
            }
        });

        findViewById(R.id.action_insert_bullets).setOnClickListener(new View.OnClickListener() {
            @Override public void onClick(View v) {
                mEditor.setBullets();
            }
        });

        findViewById(R.id.action_insert_numbers).setOnClickListener(new View.OnClickListener() {
            @Override public void onClick(View v) {
                mEditor.setNumbers();
            }
        });

        findViewById(R.id.action_insert_image).setOnClickListener(new View.OnClickListener() {
            @Override public void onClick(View v) {
                requestPermission();
            }
        });

        findViewById(R.id.action_insert_link).setOnClickListener(new View.OnClickListener() {
            @Override public void onClick(View v) {
                View inputView = LayoutInflater.from(RichEditorActivity.this).inflate(R.layout.dialog_link, null);

                EditText dialog_link = (EditText) inputView.findViewById(R.id.link);
                EditText dialog_title = (EditText) inputView.findViewById(R.id.title);
                AlertDialog.Builder linkDiialog = new AlertDialog.Builder(RichEditorActivity.this);
                linkDiialog.setTitle("输入链接")
                        .setView(inputView)
                        .setPositiveButton("确定", new DialogInterface.OnClickListener(){
                            @Override
                            public void onClick(DialogInterface dialogInterface, int i) {
                                if(dialog_title!=null && dialog_link!=null && !dialog_title.getText().toString().equals("") && !dialog_link.getText().toString().equals("")){
                                  System.out.println(dialog_link.getText().toString());
                                    System.out.println(dialog_title.getText().toString());
                                    String link = dialog_link.getText().toString();
                                    if(!link.contains("http://") && !link.contains("https://")) {
                                        link = "http://" + link;
                                    }
                                    mEditor.insertLink(link, dialog_title.getText().toString());

                                };

                            }
                        })
                        .setNegativeButton("取消", new DialogInterface.OnClickListener(){
                            @Override
                            public void onClick(DialogInterface dialogInterface, int i) {

                            }
                        })
                        .create().show();

               // mEditor.insertLink("https://github.com/wasabeef", "wasabeef");
            }
        });
 /*       findViewById(R.id.action_insert_checkbox).setOnClickListener(new View.OnClickListener() {
            @Override public void onClick(View v) {
                mEditor.insertTodo();
            }
        });*/
    }
    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        System.out.println("onActivityResult11111111");
        System.out.println("requestCode = " + requestCode);
        System.out.println("resultCode = " + resultCode);
        if (resultCode == Activity.RESULT_OK && requestCode == GET_IMAGE) {
            if(data != null){
                WritableMap params = Arguments.createMap();
                params.putString("uri", data.getData().toString());
                System.out.println("RichEditorActivity1111 senEvent 11111111111111");
                sendEvent(mReactContext, "uploadImg", params);
            }
        }
    }
    public void submit(String title, String content){

        statusLinear.setVisibility(View.GONE);
        if(title == null || title.length() < 15){
            status.setText("标题最少15个字符！");
            status.setTextColor(Color.parseColor("#FF0000"));
            statusLinear.setVisibility(View.VISIBLE);
            return;
        }
        if(content == null || content.length() < 20){
            status.setText("帖子最少20个字符！");
            status.setTextColor(Color.parseColor("#FF0000"));
            statusLinear.setVisibility(View.VISIBLE);
            return;
        }
        mProgress.setVisibility(View.VISIBLE);
        mSubmitBtn.setEnabled(false);
        mSubmitBtn.setBackgroundColor(Color.parseColor("#cccccc"));
        WritableMap params = Arguments.createMap();
        params.putString("title", title);
        params.putString("category", currentCategoryId);
        params.putString("content", content);
        sendEvent(mReactContext,"postSubmit",params);
    }

   public void requestPermission(){
       if (EasyPermissions.hasPermissions(this, perms)) {
           // 已获取权限
           // ...
           System.out.println("RichEditorActivity1111 uploadfiles 111111111111111111");
           uploadFile();
       } else {
           // 没有权限，现在去获取
           // @AfterPermissionGranted(RC_CAMERA_AND_LOCATION)
           EasyPermissions.requestPermissions(this, "应用需开启相机和储存权限",
                   RC_CAMERA_AND_LOCATION, perms);
       }
   }



    @Override
    public void onPermissionsGranted(int requestCode, @NonNull List<String> perm) {
        // 一些权限被授予
        System.out.println("onPermissionsGranted");
        if(requestCode == RC_CAMERA_AND_LOCATION){

        }
        //Toast.makeText(this, "允许", Toast.LENGTH_SHORT).show();
        /*if (EasyPermissions.hasPermissions(this, perms)) {
            // 已获取权限
            uploadFile();
        }*/
    }
    @Override
    public void onPermissionsDenied(int requestCode, @NonNull List<String> perms) {
        // 一些权限被禁止
        System.out.println("onPermissionsDenied");


    }
    @Override
    public void onRationaleAccepted(int requestCode) {
        // 一些权限被授予
        System.out.println("onRationaleAccepted");


    }

    @Override
    public void onRationaleDenied(int requestCode) {
        // 一些权限被禁止
        System.out.println("onRationaleDenied");


    }
   public void uploadFile(){
       Intent intent = new Intent(Intent.ACTION_GET_CONTENT);
       intent.setType("*/*");//设置类型，我这里是任意类型，任意后缀的可以这样写。
       intent.addCategory(Intent.CATEGORY_OPENABLE);
       startActivityForResult(intent,GET_IMAGE);
   }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        MapIntentModule.startActivityByClassnameCallback.invoke(
                "{\"activity\":\"com.discoursemobile.RichEditorActivity\",\"action\":\"finish\"}"
        );

    }
}
