$(document).ready(function(){
    console.log("CONNECTED TO JQUERY");
    $("button").click(function(e){
        console.log(e.currentTarget.id);
        fetch(`/challenges/completedTask/${e.currentTarget.id}`, {method: 'POST'})
    })
})