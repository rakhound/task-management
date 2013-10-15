<?php
//require_once(APPPATH.'/libraries/api/FirePHPCore/fb.PHP');
class Tasks extends CI_Controller {

	public function index()
	{
	    $this->load->helper('url');
		$data['base'] = base_url();
		$this->load->view('tasklist');
	}

	public function template_list()
	{
		$this->load->view('list');
	}

	public function template_detail()
	{
		$this->load->view('detail');
	}
	
	public function template_new()
	{
		//FB::info($tasks); 
		$this->load->view('new');
	}

}

/* End of file projects.php */
/* Location: ./application/controllers/projects.php */