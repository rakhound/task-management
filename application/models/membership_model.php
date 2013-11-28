<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');
require_once(APPPATH.'/libraries/FirePHPCore/fb.PHP');

class Membership_model extends CI_Model
{
    public $table = 'membership';

    function validate($data)
	{
		FB::info($data); 
		FB::info("inside validate method in member_model");
		FB::info("Username is: ".$data['UserName']);
		FB::info("Password is: ".$data['Password']); 			
		$this->db->where('UserName', $data['UserName']);
		$this->db->where('Password', $data['Password']);
		//$result =  $this->db->get($this->table)->result();
		$query =  $this->db->get($this->table);
		 if($query->num_rows == 1)
		 {
			$row =  $query->row();
			$data = array(
                    'userid' => $row->UserId,
                    'username' => $row->UserName,
                    'validated' => true
                    );
            $this->session->set_userdata($data);
			return $row;
		 }
		
		
		return null;
	}
	function logout()
	{
		$this->session->sess_destroy();
		return true;
	}
	function checkDuplicatUserName($data)
	{
		FB::info($data); 
		FB::info("inside checkDuplicatUserName method in member_model"); 
		$this->db->where('UserName', $data['UserName']);
		$query =  $this->db->get($this->table);
		return ($query->num_rows == 1);
	}
	
	public function add($data)
    {
		FB::info("inside add method in member_model"); 
		FB::info($data); 
        $this->db->insert($this->table, $data);
		FB::info($this->db->insert_id()); 
        return $this->db->insert_id();
    }

}