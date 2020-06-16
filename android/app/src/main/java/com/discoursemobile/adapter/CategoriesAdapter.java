package com.discoursemobile.adapter;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.TextView;

import com.discoursemobile.R;

import org.json.JSONArray;
import org.json.JSONException;

public class CategoriesAdapter extends BaseAdapter {

    private JSONArray mList;
    private Context mContext;
    public CategoriesAdapter(Context context, JSONArray arr) {
        this.mContext = context;
        this.mList = arr;
    }
    @Override
    public int getCount() {
        return mList.length();
    }
    @Override
    public Object getItem(int position) {
        try{
            return mList.get(position);
        }catch (JSONException e){
            return null;
        }

    }
    @Override
    public long getItemId(int position) {
        return position;
    }
    @Override
    public View getView(int position, View view, ViewGroup viewGroup) {

        view = LayoutInflater.from(mContext).inflate(R.layout.list_item,viewGroup,false);
        if(view != null){
            try{
                TextView text = (TextView)view.findViewById(R.id.text);
                text.setText(mList.getJSONObject(position).getString("cateTittle"));
            }catch (JSONException e){


            }

        }
        return view;
    }
}
