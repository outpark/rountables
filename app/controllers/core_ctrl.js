exports.index = function(req,res){
	return res.sendFile('index.html', {root: './client'});
};
