$(document).ready(function(){
    // console.log("CONNECTED TO JQUERY");
    $(".completed").click(function(e){
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
        .then(response => {
            window.location.reload()
        })
    })

    $(".delete-task").click(function(e){
        let taskId = $(e.currentTarget).data('id');
        var myRequest = new Request(`/challenges/deletetask/${taskId}`, {method: 'DELETE'});
        fetch(myRequest)
        .then(response => {
            window.location.reload()
        })
        .catch(err => {
            console.error(err);
        })
    })

    $(".delete").click(function(e){
        let taskComplete = $(e.currentTarget).data('completed');
        let taskId = $(e.currentTarget).data('id');
        fetch(`/challenges/deletechallenge/${taskId}`, 
        {
            method: 'DELETE'
        })
        .then(response => {
            window.location.reload()
        })
        .catch(err => {
            console.error(err);
        })
    })

    $("#login-form").submit(function(e){
        e.preventDefault();
        fetch(`/auth/login`, 
        {
            method: 'POST',
            body: JSON.stringify({
                username: $('#username').val(),
                password: $('#password').val()
            }),
            headers: {
                "content-type": "application/json"
            },
            credentials: "same-origin"
        })
        .then(response => {
            console.log({response})
            return response.json()
        }).then(data => {
                console.log(data);
                localStorage.authToken = data.authToken;
                return window.location.href = `/challenges/${data.id}`
            })
            .catch(err => {
                console.error(err);
            })
        // })
        // .catch(err => {
        //     console.error(err);
        // })
    })
})