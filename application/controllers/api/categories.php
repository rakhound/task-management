<?php defined('BASEPATH') OR exit('No direct script access allowed');
require_once(APPPATH.'/libraries/FirePHPCore/fb.PHP');
require APPPATH.'/libraries/REST_Controller.php';
/**
 * Projects API controller
 *
 * Validation is missing
 */
class Categories extends REST_Controller {

	public function __construct()
	{
	    parent::__construct();

	    $this->load->model('category_model');
	}

	public function index_get()
	{
		$categories = $this->category_model->get_all();
		$this->response($categories);
	}

	public function edit_get($id = NULL)
	{
		if ( ! $id)
		{
			$this->response(array('status' => false, 'error_message' => 'No ID was provided.'), 400);
		}

		$this->response($this->category_model->get($id));
	}

	public function save_post($id = NULL)
	{
		if ($id == NULL)
		{
			FB::info("Inside save_post, without id)");
			$new_id = $this->category_model->add($this->post());
			$this->response(array('status' => true, 'id' => $new_id, 'message' => sprintf('Category #%d has been created.', $new_id)), 200);
		}
		else
		{
			FB::info("Inside save_post, id)");
			$this->category_model->update($id, $this->post());
			$this->response(array('status' => true, 'message' => sprintf('Category #%d has been updated.', $id)), 200);
		}
	}

	public function remove_delete($id = NULL)
	{
		if ($this->category_model->delete($id))
		{
			$this->response(array('status' => true, 'message' => sprintf('Category #%d has been deleted.', $id)), 200);
		}
		else
		{
			$this->response(array('status' => false, 'error_message' => 'This Category does not exist!'), 404);
		}
	}
}

/* End of file categories.php */
/* Location: ./application/controllers/api/categories.php */