$(document).ready(function(){
    // console.log("CONNECTED TO JQUERY");
    $(".completed").click(function(e){
        console.log(e);
        let taskComplete = $(e.currentTarget).data('completed');
        let taskId = $(e.currentTarget).data('id');
        fetch(`/challenges/completedTask/${taskId}`, 
        {
            method: 'PUT',
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({"completed": taskComplete})
        })
    })

    $(".delete-task").click(function(e){
        console.log(e);
        let taskId = $(e.currentTarget).data('id');
        fetch(`/challenges/deletetask/${taskId}`, 
        {
            method: 'DELETE'
        })
    })

    $(".delete").click(function(e){
        console.log(e);
        let taskComplete = $(e.currentTarget).data('completed');
        let taskId = $(e.currentTarget).data('id');
        fetch(`/challenges/deletechallenge/${taskId}`, 
        {
            method: 'DELETE'
        })
    })
})