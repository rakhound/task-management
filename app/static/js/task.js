var TaskManagementApp = angular.module('TaskManagement', ['TaskManagementApi'])
TaskManagementApp.config(function($routeProvider,$locationProvider)
{
	$routeProvider.when('/', {templateUrl:"dashboard.html", controller:"categoryController"})	
	$routeProvider.when('/tasks', {templateUrl:"taskList.html", controller:"taskViewCtrl"})
	$routeProvider.when('/tasks/create', {templateUrl:"task-create.html" , controller:"newTaskCtrl"})
	// For editing a task the same template as task creation would suffice. No need for a separate template for edit.
	$routeProvider.when('/edit/:id', {templateUrl:"task-create.html" , controller:"editCtrl"})
	$routeProvider.when('/categories', {templateUrl:"categories.html", controller:"categoryController"})
	$routeProvider.when('/categories/index/:id', {templateUrl:"categories-id.html", controller:"categoryViewIdCtrl"})
	$routeProvider.when('/categories/edit/:id', {templateUrl:"categories.html", controller:"categoryController"})

})

dashboardCtrl = function($scope, Category) {
	alert('hello');
}

taskViewCtrl = function($scope, $location, Task) {

	$scope.tasks = Task.query();

	$scope.destroy = function(Task) {
		Task.destroy(function() {
			$scope.tasks.splice($scope.tasks.indexOf(Task), 1);
		});
	};

}

categoryViewIdCtrl = function($scope, $routeParams, Category, Task) {

	Category.get({id: $routeParams.id}, function(categories) {
		$scope.categories = categories;
	});

	// TODO: only tasks with matching category name should be loaded
	$scope.tasks = Task.query();

}

categoryController = function($scope, Category, TaskFormCatField) {

	$scope.TaskCategory = TaskFormCatField;
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

	$scope.select = function(category)
	{
		// Add category title to task form only for humanly readability purposes
		$scope.TaskCategory.Title = category.cat.CategoryTitle;
		//Database field is TaskCategoryId and that is what is needed to be added to task.
		//No need for a corresponding field for this in the template so we just update it here.
		$scope.task.TaskCategoryId = category.cat.CategoryId;
	}

	$scope.expand = function(category)
	{
		// Expand Category on dashboard. LEAH'S work in progress...
		//alert('CatId: '+category.cat.CategoryId+' - Redirect to page.');
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

newTaskCtrl = function ($scope, Task, $location, TaskFormCatField){
	$scope.pageTitle = "Create new task";
	$scope.TaskCategory = TaskFormCatField;
	$scope.TaskCategory.Title="";
	$scope.task = {	TaskTitle:"", DueDate:"", Notes:""}
	$scope.save = function ()
	{
		$scope.task.DueDate = new Date();
		Task.save($scope.task, function (){
			// Redirect after saving task
			$location.path('/tasks');
		});
	}
}



editCtrl = function ($scope, $routeParams, $location, Task, TaskFormCatField, Category ) {
	$scope.pageTitle="Edit task";
	$scope.TaskCategory = TaskFormCatField;
	var self = this;
	Task.get({id: $routeParams.id}, function(task) {
		self.original = task;
		$scope.task = new Task(self.original);
			Category.get({id: self.original.TaskCategoryId}, function(category) {
				$scope.TaskCategory.Title = category.CategoryTitle;
			}
			, function()
			{$scope.TaskCategory.Title = "";});
			
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

// This is meant for the category title field in the task creation and task editing forms.
// this value has no corresponding database field and is only for display purposes to show
// the user the title of the category that a task belongs to rather than the non-descriptive
// CategoryId. And because this data is shared between categoryController and
// the task creation and task editing controllers, this service is used as a means of communication
// between them.

TaskMngApi.factory('TaskFormCatField', function() {
	return {Title:"this is a test Category"};
});

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