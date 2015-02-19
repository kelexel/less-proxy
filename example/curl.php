<?php
define('CONF_CSS_GENERATOR_URL', 'http://172.16.76.1:3000/proxy');
Class CurlMe
{
	public function run($post)
	{
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_HEADER, 0);
		curl_setopt($ch, CURLOPT_VERBOSE, 0);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		// curl_setopt($ch, CURLOPT_COOKIE, $cookie);
		curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/4.0 (compatible;)");
		curl_setopt($ch, CURLOPT_URL, CONF_CSS_GENERATOR_URL);
		curl_setopt($ch, CURLOPT_POST, true);
		curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1); 
		curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($post)); 
		$response = curl_exec($ch);
		return $response;
	}
	public function testOnDemand()
	{
		$post = array(
			"template" => 'example.less',
			"destination" => 'example.css',
			"variables" => json_encode(array('bodyBackgroundColor' => 'blue')),
			"method" => 'globalVars'
		);

		$r = $this->run($post);
		var_dump($r);
	}
	public function testStream()
	{
		$post = array(
			"variables" => json_encode(array('bodyBackgroundColor' => 'blue')),
			"css" => "@import \"lesshat.less\"; body { .lh-background-image(linear-gradient(to bottom, darken(@bodyBackgroundColor, 50%) 0%, @bodyBackgroundColor 0%, darken(@bodyBackgroundColor, 20%) 100%));}",
			"method" => 'globalVars'
		);

		$r = $this->run($post);
		var_dump($r);
	}
	public function test() {
		$this->testOnDemand();
		$this->testStream();
	}
}

$o = new CurlMe();
$o->test();
?>