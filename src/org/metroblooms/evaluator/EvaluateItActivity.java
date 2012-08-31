package org.metroblooms.evaluator;

import android.os.Bundle;
import org.apache.cordova.*;

public class EvaluateItActivity extends DroidGap {
    /** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState) {
    	super.setIntegerProperty("loadUrlTimeoutValue", 120000);
        super.onCreate(savedInstanceState);
        super.loadUrl("file:///android_asset/www/index.html");
    }
}