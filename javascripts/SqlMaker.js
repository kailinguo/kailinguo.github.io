function clearParam() {
	document.getElementById("dataSpace").value='';
	document.getElementById("recordName").value='';
	document.getElementById("tableName").value='';
}

function selectSQL() {
	document.getElementById("resultSpace").focus();
	document.getElementById("resultSpace").select();
}

function productSQL() {
	var table = document.getElementById("tableName").value;
	var srcArea = document.getElementById("dataSpace");
	var srcText = srcArea.value;
	
	//var result = srcText.match(/[\r\n]/g);
	//var result = srcText.match(/[\r\n]\s*/g);
	//var result = srcText.match(/[\r\n](?!\w)/g);
	//alert(result.length);
	
	
	// ȥ�������з����пո����
	srcText = srcText.replace(/[\r\n]\s*(?!\w)/g, "");
	
	// �滻�Ʊ���
	srcText = srcText.replace(/[\t,]/g, "','");
	
	// �ֶ�
	var record = getRecordArray();
	if(record == null) {
		// SQL����
		var pad = "');\n" + "insert into " + table + " values ('";
		srcText = srcText.replace(/[\r\n]/g, pad);
		
		// ǰ����
		srcText = "insert into " + table + " values ('" + srcText + "');";
	} else {
		// SQL����
		var pad = "');\n" + "insert into " + table + "(" + record + ") values ('";
		srcText = srcText.replace(/[\r\n]/g, pad);
		
		// ǰ����
		srcText = "insert into " + table + "(" + record + ") values ('" + srcText + "');";
	}
	
	
	document.getElementById("resultSpace").value = srcText;
	
	$("#opt_5").zclip({
		path:"images/ZeroClipboard.swf",
		copy:srcText,
		beforeCopy:function(b){
			console.log(b);
		},
		afterCopy:function(){
			console.log("done");
		}
	});
}

function getRecordArray() {
	var record = document.getElementById("recordName").value;
	if(record.match(/^\s$/) != null || record.length == 0) {
		return null;
	}
	if(record.match(/,/) != null) {
		var tmp = record.replace(/\s/g, "");
		// alert(tmp);
		return tmp;
	}
	var tmp = record.replace(/\s+/g, ",");
	// alert(tmp);
	return tmp;
}
