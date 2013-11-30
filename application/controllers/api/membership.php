<?php defined('BASEPATH') OR exit('No direct script access allowed');
require_once(APPPATH.'/libraries/FirePHPCore/fb.PHP');
require APPPATH.'/libraries/REST_Controller.php';
/**
 * Projects API controller
 *
 * Validation is missing
 */
class Membership extends REST_Controller {

	public function __construct()
	{
	    parent::__construct();

	    $this->load->model('membership_model');
	}

	public function index_get()
	{
		$members = $this->membership_model->get_all();		
		$this->response($members);
	}

	public function edit_get($user)
	{
		if ( !$user)
		{
			$this->response(array('status' => false, 'error_message' => 'User data not provided.'), 400);
		}

		$this->response($this->member_model->validate($user));
	}

	public function save_post($id = NULL)
	{
		if($this->membership_model->checkDuplicatUserName($this->post()))	
		{
			$this->response(array('status' => false, 'error_message' => 'User name is already in use.'), 400);
		}
		
		if ($id == NULL)
		{
			FB::info("Inside save_post, without id)");
			$new_id = $this->membership_model->add($this->post());
			$this->response(array('status' => true, 'id' => $new_id, 'message' => sprintf('User #%d has been created.', $new_id)), 200);
		}
		else
		{
			FB::info("Inside save_post, id)");
			$this->membership_model->update($id, $this->post());
			$this->response(array('status' => true, 'message' => sprintf('User #%d has been updated.', $id)), 200);
		}
	}

	public function remove_delete($id = NULL)
	{
		if ($this->membership_model->logout($id))
		{
			$this->response(array('status' => true, 'message' => sprintf('User #%d has been deleted.', $id)), 200);
		}
		else
		{
			$this->response(array('status' => false, 'error_message' => 'This User does not exist!'), 404);
		}
	}
	
	public function login_post()
	{
		FB::info("inside login_post method in member_model"); 
		FB::info($this->post()); 
		$user = $this->membership_model->validate($this->post());
		
		if($user)		
		{	
			$this->response(array('status' => true, 'user'=> $user, 'message' => sprintf('login has been successful')), 200);
		}
		else
		{
			$this->response(array('status' => false, 'error_message' => 'This login information is not correct!'), 404);
		}
	}
}

/* End of file projects.php */
/* Location: ./application/controllers/api/projects.php */