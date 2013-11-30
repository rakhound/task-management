var TaskManagementApp = angular.module('TaskManagement', ['TaskManagementApi'])
TaskManagementApp.config(function($routeProvider,$locationProvider)
{
	$routeProvider.when('/', {templateUrl:"user-login.html", controller:"userLoginCtrl"})
	$routeProvider.when('/dashboard', {templateUrl:"dashboard.html", controller:"categoryController"})
	$routeProvider.when('/register', {templateUrl:"user-register.html", controller:"newUserCtrl"})
	$routeProvider.when('/tasks', {templateUrl:"task-list.html", controller:"taskViewCtrl"})
	$routeProvider.when('/tasks/create', {templateUrl:"task-create.html" , controller:"newTaskCtrl"})
	$routeProvider.when('/tasks/edit/:id', {templateUrl:"task-edit.html" , controller:"editCtrl"})
	$routeProvider.when('/categories', {templateUrl:"categories.html", controller:"categoryController"})
	$routeProvider.when('/categories/index/:id', {templateUrl:"categories-id.html", controller:"categoryViewIdCtrl"})
	$routeProvider.when('/categories/edit/:id', {templateUrl:"categories.html", controller:"categoryController"})

})

dashboardCtrl = function($scope, Category) {
	alert('hello');
}

taskViewCtrl = function($scope, $location, Task, UserService) {
	
	$scope.user = UserService;
	if ($scope.user.isLogged == false)
	{
		$location.path('/');
		return;
	}
	
	$scope.tasks = Task.query();

	$scope.destroy = function(Task) {
		Task.destroy(function() {
			$scope.tasks.splice($scope.tasks.indexOf(Task), 1);
		});
	};

}

categoryViewIdCtrl = function($scope, $location, $routeParams, Category, Task, UserService) {
	$scope.user = UserService;
	if ($scope.user.isLogged == false)
	{
		$location.path('/');
		return;
	}
	Category.get({id: $routeParams.id}, function(categories) {
		$scope.categories = categories;
	});

}

categoryController = function($scope, $location, Category, UserService) {
	
	$scope.user = UserService;
	if ($scope.user.isLogged == false)
	{
		$location.path('/');
		return;
	}
	var cats = Category.query(function(data){
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
		// Add category to task form
		$scope.task.TaskCat = category.cat.CategoryTitle;
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

newTaskCtrl = function ($scope, Task, $location, UserService ){
	
	$scope.user = UserService;
	if ($scope.user.isLogged == false)
	{
		$location.path('/');
		return;
	}
	
	$scope.task = {	TaskTitle:"", DueDate:"", Notes:"", UserId:""}
	$scope.save = function ()
	{
		$scope.task.DueDate = new Date();
		$scope.task.UserId = $scope.user.UserId;
		Task.save($scope.task, function (){
			// Redirect after saving task
			$location.path('/dashboard');
		});

		$scope.RemainTime = parseInt($scope.task.BudgetTime) - parseInt($scope.task.SpentTime);
	}

}

editCtrl = function ($scope, $routeParams, $location, Task) {

	var self = this;
	Task.get({id: $routeParams.id}, function(task) {
		self.original = task;
		$scope.task = new Task(self.original);
		$scope.RemainTime = parseInt($scope.task.BudgetTime) - parseInt($scope.task.SpentTime);
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

newUserCtrl = function ($scope, User, $location, UserService){
	$scope.duplicate=false;
	$scope.user = {}
	$scope.save = function ()
	{
		$scope.user.Password = CryptoJS.MD5($scope.user.Password).toString();
		$scope.confirmPswd = $scope.user.Password;
		User.save($scope.user, function (){
			// Redirect after saving task
			$location.path('/dashboard');
		}, function(msg){
			 if(msg.data.error_message == 'User name is already in use.')
			 {
				 $scope.duplicate= true;
			 }
		});
	}
}

userLoginCtrl = function ($scope, User, $location, UserService){
	 if(UserService.isLogged)
	 {
		User.remove(UserService.UserId);
		
	 }
	 
	$scope.user = {};
	
	$scope.login = function ()	{
		 $scope.user.Password = CryptoJS.MD5($scope.user.Password).toString();
		 User.loginUser($scope.user, function(data){
		 UserService.isLogged = true;
		 UserService.username = data.user.UserName;
		 UserService.userId = data.user.UserId;
		 $location.path('/dashboard');
	   });
	}
}

var TaskMngApi = angular.module('TaskManagementApi', ['ngResource'])
TaskMngApi.factory('Task', function($resource) {
	var Task = $resource('http://localhost/task-management/index.php/api/tasks/:method/:id', {}, {
		query: {method:'GET', params: {method:'index'}, isArray:true },
		save: {method:'POST', params: {method:'save'} },
		get: {method:'GET', params: {method:'edit'} },
		remove: {method:'DELETE', params: {method:'remove'} },
		tasksInCategory: {method:'GET', params: {method:'tasksInCategory'} },
		getUserTasks: {method:'GET', params: {method:'userTasks'} }
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

TaskMngApi.factory('User', function($resource) {
	var User = $resource('http://localhost/task-management/index.php/api/membership/:method/:id', {}, {
		query: {method:'GET', params: {method:'index'}, isArray:true },
		save: {method:'POST', params: {method:'save'} },
		get: {method:'GET', params: {method:'edit'} },
		remove: {method:'DELETE', params: {method:'remove'} },
		loginUser: {method:'Post', params: {method:'login'} }
	});

	User.prototype.update = function(cb) {
		return User.save({id: this.UserId},
			angular.extend({}, this, {UserId:undefined}, cb))
	};
	

	User.prototype.destroy = function(cb) {
		return User.remove({id: this.UserId}, cb);
	};

	return User;
});

TaskManagementApp.factory('UserService', function() {
	var sdo = {
		isLogged: false,
		username: '',
		userId : ''
	};
	return sdo;
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

TaskManagementApp.directive('pwCheck', function () {
	return {
		require: 'ngModel',
		link: function (scope, elem, attrs, ctrl) {
			var firstPassword = '#' + attrs.pwCheck;
			elem.add(firstPassword).on('keyup', function () {
				scope.$apply(function () {
					ctrl.$setValidity('pwMatch', elem.val() === $(firstPassword).val());
				});
			});
		}
	}
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

