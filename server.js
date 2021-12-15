'use strict';

// モジュール
const express = require( 'express' );
const http = require( 'http' );
const socketIO = require( 'socket.io' );
const {PythonShell} = require('python-shell');

const pyshell = new PythonShell('LoRa2server.py');

// グローバルなやつら
const app = express();
const server = http.Server( app );
const io = socketIO( server );
const PORT = process.env.PORT || 3000;


// 関数
// 数字を２桁の文字列に変換
const toDoubleDigitString =
    ( num ) =>
    {
        return ( "0" + num ).slice( -2 );   // slice( -2 )で後ろから２文字取り出す。
    };

// 時刻文字列の作成（書式は「YY/DD/MM hh:mm ss」）
const makeTimeString =
    ( time ) =>
    {
        return toDoubleDigitString( time.getFullYear() ) + '/' + toDoubleDigitString( time.getMonth() + 1 ) + '/' + toDoubleDigitString( time.getDate() )
            + ' ' + toDoubleDigitString( time.getHours() ) + ':' + toDoubleDigitString( time.getMinutes() ) + ' ' + toDoubleDigitString( time.getSeconds() );
    }

// 裏でPython実行
pyshell.on('message', function (data) {
    let p = JSON.stringify(data)
    console.log(p);
    // 現在時刻の文字列の作成
    let strNow = makeTimeString( new Date() );
    let objLoRaMessage = {
        strMessage: p,
        strDate: strNow,
        strNickname: "LoRa_Device",
        strID: "",
    }
    io.emit( 'spread message', objLoRaMessage );
});

// 接続時の処理
// ・サーバーとクライアントの接続が確立すると、
// 　サーバー側で、'connection'イベント
// 　クライアント側で、'connect'イベントが発生する
io.on(
    'connection',
    ( socket ) =>
    {
        console.log( 'connection' );
        // コネクションごとで固有のニックネーム。イベントをまたいで使用される。
        let strID = '';
        

        // 切断時の処理
        // ・クライアントが切断したら、サーバー側では'disconnect'イベントが発生する
        socket.on(
            'disconnect',
            () =>
            {
                console.log( 'disconnect' );
            } );

        // 入室時の処理
        // ・クライアント側のメッセージ送信時の「socket.emit( 'join', strNickname );」に対する処理
        socket.on(
            'join',
            ( strID_ ) =>
            {
                console.log( 'connected :', strID_ );

                // コネクションごとで固有のニックネームに設定
                strID = strID_;
            } );

        // 新しいメッセージ受信時の処理
        // ・クライアント側のメッセージ送信時の「socket.emit( 'new message', $( '#input_message' ).val() );」に対する処理
        socket.on(
            'new message',
            ( receivedDATA ) =>
            {
                console.log( 'new message', receivedDATA );

                // 現在時刻の文字列の作成
                let strNow = makeTimeString( new Date() );

                // メッセージオブジェクトの作成
                let objMessage = {
                    strMessage: receivedDATA.strMessage,
                    strDate: strNow,
                    strNickname: receivedDATA.strNickname,
                    strID: strID,
                }

                // 送信元含む全員に送信
                //io.emit( 'spread message', strMessage );
                io.emit( 'spread message', objMessage );
            });
    } );

// 公開フォルダの指定
app.use( express.static( __dirname + '/public' ) );

// サーバーの起動
server.listen(
    PORT,
    () =>
    {
        console.log( 'Server on port %d', PORT );
    } );

