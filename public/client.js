// クライアントからサーバーへの接続要求
const socket = io.connect();
let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

// 接続時の処理
// ・サーバーとクライアントの接続が確立すると、
// 　サーバー側で、'connection'イベント
// 　クライアント側で、'connect'イベントが発生する
socket.on(
    'connect',
    () =>
    {   
        console.log( 'connect' );

        let randID = '';
        for ( var i = 0; i < 8; i++ ) {
            randID += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        console.log('my ID is : ' + randID);
        socket.emit( 'join', randID );
    } );


// 「Send」ボタンを押したときの処理
$( 'form' ).submit(
    () =>
    {
        // console.log( '#nickname:', $( '#nickname' ).val() );
        // console.log( '#input_message :', $( '#input_message' ).val() );
        let sendDATA = {
            strMessage: $( '#input_message' ).val(),
            strNickname: $( '#nickname' ).val(),
        };
        console.log( 'sending DATA : ',sendDATA);
        

        if( $( '#input_message' ).val() )
        {
                // サーバーに、イベント名'new message' で入力テキストを送信
                //socket.emit( 'new message', $('#input_message').val());
                socket.emit( 'new message', sendDATA);
                $( '#input_message' ).val( '' );    // テキストボックスを空に。
        }
        return false;   // フォーム送信はしない
    } );
// サーバーからのメッセージ拡散に対する処理
// ・サーバー側のメッセージ拡散時の「io.emit( 'spread message', strMessage );」に対する処理
socket.on(
    'spread message',
    //( strMessage ) =>
    ( objMessage ) =>
    {
        //console.log( 'spread message :', strMessage );
        console.log( 'DATA from server :', objMessage );
        console.log(objMessage.strID);

        // リストの一番上に追加
        $("#message_list").prepend(
            $("<tr></tr>")
            // 拡散されたメッセージをメッセージリストに追加
                .append($("<td style='width:15%'></td>").text(objMessage.strDate))
                .append($("<td style='width:15%'></td>").text(objMessage.strNickname))
                .append($("<td style='width:70%'></td>").text(objMessage.strMessage))
        );

    } );

