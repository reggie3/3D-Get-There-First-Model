function ms2Time(ms) {
    var secs = ms / 1000;
    ms = Math.floor(ms % 1000);
    var minutes = secs / 60;
    secs = Math.floor(secs % 60);
    var hours = minutes / 60;
    minutes = Math.floor(minutes % 60);
    hours = Math.floor(hours % 24);
    return hours + ":" + minutes + ":" + secs + "." + ms + " (H:M:S)";  
}