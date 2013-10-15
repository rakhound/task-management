var app= angular.module('routPractice', ['taskApi'])
app.config(function($routeProvider,$locationProvider)
{
	$routeProvider.when('/', {templateUrl:"taskList.html", controller:"dashboardCtrl"})
	$routeProvider.when('/new', {templateUrl:"new.html" , controller:"createCtrl"})
	$routeProvider.when('/edit/:id', {templateUrl:"new.html" , controller:"editCtrl"})
		
})

dashboardCtrl = function($scope, $location, Task){
  $scope.tasks = Task.query();
 }

createCtrl = function ($scope, Task){

	$scope.task = {	DESCRIPTION:"", DUE_DATE:"", NOTE:""}
	$scope.save = function ()
	{
		$scope.task.DUE_DATE = new Date();
		Task.save($scope.task);
	}
	
}

editCtrl = function ($scope, $routeParams, Task){

	var self = this;
  Task.get({id: $routeParams.id}, function(task) {

    self.original = task;
    $scope.task = new Task(self.original);
  });

  $scope.isClean = function() {
    return angular.equals(self.original, $scope.task);
  };

  $scope.destroy = function() {
    self.original.destroy(function() {
      $location.path('/');
    });
  };

  $scope.save = function() {
    $scope.task.update(function() {
      $location.path('/');
    });
  };
}

angular.module('taskApi', ['ngResource']).
  factory('Task', function($resource) {
    var Task = $resource('http://localhost/task-manager/index.php/api/tasks/:method/:id', {}, {
      query: {method:'GET', params: {method:'index'}, isArray:true },
      save: {method:'POST', params: {method:'save'} },
      get: {method:'GET', params: {method:'edit'} },
      remove: {method:'DELETE', params: {method:'remove'} }
    });

    Task.prototype.update = function(cb) {
	
	  console.log(Task.save({id: this.id},
          angular.extend({}, this, {ID:undefined}), cb))	
      return Task.save({id: this.ID},
          angular.extend({}, this, {ID:undefined}, cb))
    };
    return Task;
  });

