<?php
use function igk_resources_gets as  __;

igk_js_no_autoload(dirname(__FILE__)."/Scripts");

function igk_html_node_webglsurface(){
    $n = igk_createnode("div");
    $n["class"] = "igk-webgl-surface";
    // $n->Content = __("initializing...");
    return $n;
}

function igk_html_node_webglapp(){
    $n = igk_createnode("div");
    $n["class"] = "app-webgl";
    // $n->Content = __("initializing...");

    return $n;
}