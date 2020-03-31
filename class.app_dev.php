<?php
//***
//author:C.A.D. BONDJE DOUE
//description:
//created:2020-29-03_11:00:10
//copyright: IGKDEV &copy; 2011-2020 all rights reserved
//type: controller
//***

//
//controller code class declaration
//file is a part of the controller tab list
//

///<summary></summary>
class app_dev extends IGKApplicationController {
	public function getName(){return get_class($this);}
	protected function InitComplete(){
		parent::InitComplete();
		//please enter your controller declaration complete here

	}
	///<summary> init target node </summary>
	protected function initTargetNode(){
		$node =  parent::initTargetNode();
		return $node;
	}
	//----------------------------------------
	//Please Enter your code declaration here
	//----------------------------------------

	///<summary>override to handle your custom view mecanism</summary>
	//public function View(){
	//	parent::View();
	//}
}