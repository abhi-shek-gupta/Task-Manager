var app=angular.module("myapp",['ngRoute','ngMessages']);

app.config(function($routeProvider,$locationProvider){
    $routeProvider.when('/',{
        templateUrl:'views/registerLogin.html',
        controller:'register'
    });
    $routeProvider.when('/login',{
        templateUrl:'views/registerLogin.html',
        controller:'login'
    });
    $routeProvider.when('/createTodo',{
        templateUrl:'views/addTodo.html',
        controller:'userPage'
    });
    $routeProvider.when('/todo',{
        templateUrl:'views/addTodo.html',
        controller:'userPage'
    });
    $routeProvider.when('/checkToDo/',{
        templateUrl:'views/addTodo.html',
        controller:'userPage'
    });

    $routeProvider.when('/404',{
        templateUrl:'views/404.html'
    });
    $routeProvider.otherwise({
        redirectTo:'/404'
    });
    $locationProvider.html5Mode(true);
})

app.controller('register',function($scope,$http){
    $scope.display="register";
    console.log("registerLogin controller load");
    $scope.submitForm=function(){
        $http({
            url:'/registration',
            method:'POST',
            data:$scope.body
            // 'body.email' : $scope.email,
            // 'body.password':$scope.password
            // console.log(req)
        }).then(function(res){
            $scope.body={};
            console.log("success ");
            console.log(res);
            alert("Sign up Succesful !")
             $location.path('/login');
              },function(res){
            console.log("error");
            console.log(res);
        })
    }
})//register controller end


app.controller('login',function($scope,$http,$location){
    console.log("Login controller load");
    $scope.display="login";
    $scope.submitForm=function(){
        $http({
            url:'/login',
            method:'POST',
            data:$scope.body
            // 'body.email' : $scope.email,
            // 'body.password':$scope.password
            // console.log(req)
        }).then(function(res){
            $scope.body={};
            alert("Login up Succesful !");
            console.log("success ");
            console.log(res);
            localStorage.setItem('tokenLocal', res.data.token);//store jwt in browser"s local storage
            // console.log(localStorage.getItem('tokenLocal'))
             $location.path('/createTodo');
              },function(res){
            console.log("error");
            console.log(res);
        })
    }
});//login controller end



app.controller('userPage',function($scope,$http){
     console.log("userPage controller load");
//refresh function is to show all tasks
    var refresh=function(){
        $http({
            url:'/api/todo',
            method:'GET',
            // data:$scope.body,
            headers:{
                "x-access-token":localStorage.getItem('tokenLocal')
            }    
        }).then(function(res){
            $scope.body={};
            console.log("success refresh show todo ");
            console.log(res);
        $scope.taskArr=res.data.data;
              },function(res){
            console.log("error");
            console.log(res);
        })

    };//end of refresh();
    refresh();//manual call

    $scope.addTask=function(){
        $http({
            url:'/api/CreateTodo',
            method:'POST',
            data:$scope.body,
            headers:{
                "x-access-token":localStorage.getItem('tokenLocal')
            }
            
        }).then(function(res){
            $scope.body={};
            console.log(res);
            refresh();
              },function(res){
            console.log("error");
            console.log(res);
        })

    };//end of addTask()
      
    $scope.checkTask=function(_id){
        console.log("inside checKtask function");
        console.log(_id);
        var task_id={"_id":_id};
        $http({
            url:'/api/checkTodo',
            method:'POST',
            data:task_id,
            headers:{
                "x-access-token":localStorage.getItem('tokenLocal')
            }
        }).then(function(res){
            console.log("Task completed");
            console.log(res)
              alert( "Congratulations !"+res.data.data.name +" completed")
              $scope.taskArr=res.data.data;
              refresh();

        },function(res){})

    }
    
})