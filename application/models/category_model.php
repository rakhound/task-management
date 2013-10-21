<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Category_model extends CI_Model
{
    public $table = 'category';

    public function get_all()
    {
        return $this->db->get($this->table)->result();
    }
    
    public function get($id)
    {
        return $this->db->where('CategoryId', $id)->get($this->table)->row();
    }
  
    public function add($data)
    {
		FB::info("inside add method in category_model"); 
		FB::info($data); 
        $this->db->insert($this->table, $data);
		FB::info($this->db->insert_id()); 
        return $this->db->insert_id();
    }

    public function update($id, $data)
    {
        return $this->db->where('CategoryId', $id)->update($this->table, $data);
    }

    public function delete($id)
    {
        $this->db->where('CategoryId', $id)->delete($this->table);
        return $this->db->affected_rows();
    }

}

/* End of file category_model.php */
/* Location: ./application/models/category_model.php */