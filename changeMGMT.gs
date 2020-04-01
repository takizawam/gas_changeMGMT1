function onMyEdit(e) {
	//Log保存用シートの名前
	var logSheetName = 'Log';
    Logger.log("aaaaaa"); //5
	// スプレッドシート
	var ss = SpreadsheetApp.getActiveSpreadsheet();
	// スプレッドシート名
	var ssName = ss.getName();
    Logger.log("b"); //5
	// 選択シート
	var sheet = ss.getActiveSheet();
	// 選択シート名
	var sheetName = sheet.getName();
	// Logシートなら何もしない
	if (sheetName == logSheetName) {
		return;
	}

	// 選択セル範囲
	var range = sheet.getActiveRange();
    Logger.log("c"); //5
	// セル範囲の行番号
	var rowIndex = range.getRowIndex();
	// セル範囲の列番号
	var colIndex = range.getColumnIndex();

	// getRange(始点行, 始点列, 取得する行数, 取得する列数)
	var v = sheet.getRange(rowIndex, colIndex, 1, 1).getValue();
	//内容が空だ
	if (v == '') {
		v = '※削除※';
	}
    
    // 前の値
    var oldValue = e.oldValue;

	//更新者情報は法人向けGoogle Appsの同一ドメインでないと取得できないかも？ふつうの @gmail.com だと無理かも？
	//https://productforums.google.com/forum/#!topic/docs/5D23Os_NIAc

	//更新者のメールアドレス
	var email = Session.getActiveUser().getEmail();
    Logger.log("d"); //5
	//ここからLogシートに書き込み
	//Log保存用シート
	var logSheet = ss.getSheetByName(logSheetName);
	//引数で指定した行の前の行に1行追加
     
    //①列の先頭行から下方向に取得する
    var lastRow1 = logSheet.getRange(1, 1).getNextDataCell(SpreadsheetApp.Direction.DOWN).getRow();
    Logger.log("e"); //5
    Logger.log(lastRow1);
    logSheet.insertRowAfter(lastRow1);
    Logger.log("f"); //5

	//日付
	logSheet.getRange(lastRow1+1, 1).setNumberFormat('yyyy/mm/dd(ddd)');
	logSheet.getRange(lastRow1+1, 1).setValue(new Date());
	//時刻
	logSheet.getRange(lastRow1+1, 2).setNumberFormat('h:mm:ss');
	logSheet.getRange(lastRow1+1, 2).setValue(new Date());
	//更新者
	logSheet.getRange(lastRow1+1, 3).setValue(email);
	//シート名
	logSheet.getRange(lastRow1+1, 4).setValue(sheetName);
	//行番号
	logSheet.getRange(lastRow1+1, 5).setValue(rowIndex);
	//列番号
	logSheet.getRange(lastRow1+1, 6).setValue(colIndex);
    //変更前セルの内容(Stringフォーマットにする)
	logSheet.getRange(lastRow1+1, 7).setValue(oldValue);
	//変更セルの内容(Stringフォーマットにする)
	logSheet.getRange(lastRow1+1, 8).setNumberFormat('@');  
	logSheet.getRange(lastRow1+1, 8).setValue(v);  


/*
	//Slackに通知する場合
	//tokenを取得(ボタン押す)→ https://api.slack.com/web
	//channels:id取得(ボタン押す)→ https://api.slack.com/methods/channels.list/test
	//先に更新通知用チャンネルを作っておいた方が良いかも？

	var token = 'ここにtoken';
	var channel = 'ここにchannelId';
	var userName = 'Spreadsheets'; // Slack投稿時に使われる好きな名前

	//Slackに通知するテキスト
	var text = '「'+sheetName + '」シート変更: ' + email + ' [' + rowIndex + ',' + colIndex + '] ' + v;

	UrlFetchApp.fetch('https://slack.com/api/chat.postMessage', {
		method: 'post',
		payload: {
			token: token,
			channel: channel,
			username: userName,
			text: text
		}
	});
	//実行トランスクリプトに「実行に失敗: fetch を呼び出す権限がありません」
	//と出た場合、メニューから実行して承認してやる必要あり？
	//こちらもやはりGoogle Apps for work でないとだめかも？
	//https://code.google.com/p/google-apps-script-issues/issues/detail?id=677
*/
}
