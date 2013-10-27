var TaskManagementApp = angular.module('TaskManagement', ['TaskManagementApi'])
TaskManagementApp.config(function($routeProvider,$locationProvider)
{
	$routeProvider.when('/', {templateUrl:"taskList.html", controller:"dashboardCtrl"})
	$routeProvider.when('/tasks/create', {templateUrl:"task-create.html" , controller:"newTaskCtrl"})
	$routeProvider.when('/tasks/edit/:id', {templateUrl:"task-edit.html" , controller:"editCtrl"})
	$routeProvider.when('/categories', {templateUrl:"categories.html", controller:"categoryController"})
		
})

dashboardCtrl = function($scope, $location, Task){
  $scope.tasks = Task.query();
  
  $scope.destroy = function(Task) {
    Task.destroy(function() {
      $scope.tasks.splice($scope.tasks.indexOf(Task), 1);
    });
  };
}

categoryController = function($scope, Category) {

	var cats = Category.query(function(){

		var catData=[];
		flatArrToNestedArr(cats, catData);
		$scope.categories = catData;
	});

	$scope.toggle = function(cat)
	{
	    var count = cat.children.length;
		for(var  i= 0; i < count; i++)
		{
			if(cat.children[i].show === undefined)
			{
				cat.children[i].show = true;
			}
			else
			{
				var show = cat.children[i].show;
				cat.children[i].show = !show;
			}
		}

		// TODO-ROYA probably don't need this condition at all, if they toggle,
		// probably they still need to continue with creating new child.
		// TODO-ROYA also to handle the case when the user chooses to add a childNodes
		// and then without cancelling or without toggling the current cat, they toggle
		// the parent of the mom-to-be, so the text box is not visible due to collapse
		// but still there and the tree in freeze mode due to delivery mode. is not user friendly.	
		if(cat.isDelivering == true)
		{
			cat.isDelivering = false;
			$scope.noMoreDelivery = false;
		}

		if(cat.isExpanded === undefined )
		{
			cat.isExpanded = true;
		}
		else
		{
			cat.isExpanded = !cat.isExpanded;
		}
	}
	
	$scope.add = function(category)
	{
		if($scope.noMoreDelivery)
			return;
		$scope.newCat = {ParentId: category.cat.CategoryId, CategoryTitle:""}
		category.isDelivering = true;
		$scope.noMoreDelivery = true;
	}

	$scope.addToTask = function(category)
	{
		// Add category to task
		alert(category.cat.CategoryTitle);

	}

	$scope.cancel= function(category)
	{
		category.isDelivering = false;
		$scope.noMoreDelivery = false;
	}
	
    $scope.save = function (cat)
	{
		Category.save($scope.newCat, function(data){
			var obj = { cat:  { CategoryId: data.id,
                               ParentId: $scope.newCat.CategoryId,
                               CategoryTitle: $scope.newCat.CategoryTitle
                              },
                        children:[]};
			cat.children.push(obj);
			$scope.cancel(cat);
			$scope.toggle(cat);
		});
	}
}

newTaskCtrl = function ($scope, Task, $location){

	$scope.task = {	TaskTitle:"", DueDate:"", Notes:""}
	$scope.save = function ()
	{
		$scope.task.DueDate = new Date();
		Task.save($scope.task, function (){
			$location.path('/');
		});
	}
}

editCtrl = function ($scope, $routeParams, $location, Task){

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

var TaskMngApi = angular.module('TaskManagementApi', ['ngResource'])
TaskMngApi.factory('Task', function($resource) {
    var Task = $resource('http://localhost/task-management/index.php/api/tasks/:method/:id', {}, {
      query: {method:'GET', params: {method:'index'}, isArray:true },
      save: {method:'POST', params: {method:'save'} },
      get: {method:'GET', params: {method:'edit'} },
      remove: {method:'DELETE', params: {method:'remove'} }
    });

    Task.prototype.update = function(cb) {
        var rv = angular.extend({}, this, {TaskId:undefined});
        return Task.save({id: this.TaskId}, rv, cb);
    };
	
	Task.prototype.destroy = function(cb) {
      return Task.remove({id: this.TaskId}, cb);
    };
    return Task;
});


TaskMngApi.factory('Category', function($resource) {
	var Category = $resource('http://localhost/task-management/index.php/api/categories/:method/:id', {}, {
      query: {method:'GET', params: {method:'index'}, isArray:true },
      save: {method:'POST', params: {method:'save'} },
      get: {method:'GET', params: {method:'edit'} },
      remove: {method:'DELETE', params: {method:'remove'} }
	});

	Category.prototype.update = function(cb) {
      return Category.save({id: this.CategoryId},
          angular.extend({}, this, {CategoryId:undefined}, cb))
	};

	Category.prototype.destroy = function(cb) {
      return Category.remove({id: this.CategoryId}, cb);
	};

	return Category;
});


TaskManagementApp.directive('ngEnter', function() {
	return function(scope, element, attrs) {
		element.bind("keydown", function(event) {
			if(event.which === 13) {
				scope.$apply(function(){
					scope.$eval(attrs.ngEnter);
				});

				event.preventDefault();
			}
		});
	};
});

// TODO-ROYA: not sure if this piece of logic belongs to here or
// it belongs to the server side, i.e leave it to the server hierarchize
// the data before sending it over to the client. I should decide.

function flatArrToNestedArr(flatArr, nestedArr)
{
   for(var i =0; i<flatArr.length; i++)
   {
		if(flatArr[i].ParentId == 0)
		{
			var obj = {cat: flatArr[i], children:[]}
			nestedArr.push(obj);
		}
		else
		{
			addToParent(flatArr[i], nestedArr);
		}
   }
}
function addToParent(childCat , arr)
{
	for(var i=0; i<arr.length; i++)
	{
		if(childCat.ParentId == arr[i].cat.CategoryId)
		{
			arr[i].children.push({cat: childCat, children:[]});
			return;
		}
		else
		{
			addToParent(childCat, arr[i].children);
		}
	}
}