package com.discoursemobile.manager;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.util.Log;

import com.discoursemobile.helper.DBHelper;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.List;

public class DBManager {
    private static final String TAG = "USERS";
    private DBHelper dbHelper;

    private final String[] USERS_COLUMNS = new String[] {
            "username",
            "name",
            "avatar_template",
            "csrf",
            "is_login"
    };

    public DBManager(Context context) {
        this.dbHelper = new DBHelper(context);
    }

    /**
     * 是否存在此条数据
     * @return bool
     */
    public boolean isExistsUser(SQLiteDatabase db, String username) {
        boolean isExists = false;
        Cursor cursor = null;
        try {
            String sql = "select * from users where username = ?";
            cursor = db.rawQuery(sql, new String[]{username});
            if (cursor.getCount() > 0) {
                isExists = true;
            }
        } catch (Exception e) {
            Log.e(TAG, "isExistsUser query error", e);
        }
        return isExists;
    }
    /**
     * 保存数据
     */
    public int setUser(String username, String name, String avatar_template, String csrf) {
        SQLiteDatabase db = null;
        try {
            db = dbHelper.getWritableDatabase();
            ContentValues cv = new ContentValues();
            cv.put("username", username);
            cv.put("name", name);
            cv.put("avatar_template", avatar_template);
            cv.put("csrf", csrf);
            cv.put("is_login","1");
            if(isExistsUser(db, username)){
                String[] args = {String.valueOf(username)};
               int rs = db.update(DBHelper.USERS,cv, "username=?",args);
               return rs;
            }else{
               long rs =  db.insert(DBHelper.USERS, null, cv);
               return (int)rs;
            }
        } catch (Exception e) {
            Log.e(TAG, "setUser error", e);
            return -1;
        } finally {
            if (db != null) {
                db.close();
            }
        }
    }
    /**
     * 查询数据
     */
    public JSONArray  getUser() {
        SQLiteDatabase db = null;
        try {
            db = dbHelper.getWritableDatabase();
            Cursor result =  db.query(DBHelper.USERS, new String[]{"username", "name", "avatar_template", "csrf", "is_login"},"is_login=?",new String[]{String.valueOf("1")},null,null,null);
            JSONArray json = new JSONArray();
            if(result.moveToFirst()){
                while(!result.isAfterLast()){
                    JSONObject obj = new JSONObject();
                    try {
                        obj.put("username", result.getString(result.getColumnIndex("username")));
                        obj.put("name", result.getString(result.getColumnIndex("name")));
                        obj.put("avatar_template", result.getString(result.getColumnIndex("avatar_template")));
                        obj.put("csrf", result.getString(result.getColumnIndex("csrf")));
                        obj.put("is_login", result.getString(result.getColumnIndex("is_login")));
                        json.put(obj);
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                    result.moveToNext();
                };
            }
            return json;
        } catch (Exception e) {
            Log.e(TAG, "setUser error", e);
            return null;
        } finally {
            if (db != null) {
                db.close();
            }
        }
    }
    /**
     * 删除数据
     */
    public int deleteUser() {
        SQLiteDatabase db = null;
        try {
            db = dbHelper.getWritableDatabase();
            int rs = db.delete(DBHelper.USERS,null,null);
            return rs;
        } catch (Exception e) {
            Log.e(TAG, "setUser error", e);
            return -1;
        } finally {
            if (db != null) {
                db.close();
            }
        }
    }
}