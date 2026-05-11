/**
 * LINE × GAS おみくじボット（シンプル版）
 *
 * 使い方:
 *   1. スクリプトプロパティに CHANNEL_ACCESS_TOKEN を設定する
 *   2. 「デプロイ」→「新しいデプロイ」→ 種類「ウェブアプリ」
 *      - 次のユーザーとして実行: 自分
 *      - アクセスできるユーザー: 全員
 *   3. 発行された URL を LINE Developers の Webhook URL に貼り付ける
 */

const LINE_REPLY_ENDPOINT = 'https://api.line.me/v2/bot/message/reply';

const FORTUNES = [
  '大吉',
  '中吉',
  '小吉',
  '吉',
  '末吉',
  '凶',
  '大凶'
];

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const events = body.events || [];

    events.forEach(function (event) {
      if (event.type === 'message' && event.message.type === 'text') {
        const fortune = drawFortune();
        replyMessage(event.replyToken, '今日の運勢は【' + fortune + '】です！');
      }
    });
  } catch (err) {
    console.error(err);
  }

  return ContentService.createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function drawFortune() {
  const index = Math.floor(Math.random() * FORTUNES.length);
  return FORTUNES[index];
}

function replyMessage(replyToken, text) {
  const token = PropertiesService.getScriptProperties()
    .getProperty('CHANNEL_ACCESS_TOKEN');

  if (!token) {
    throw new Error('CHANNEL_ACCESS_TOKEN がスクリプトプロパティに設定されていません');
  }

  const payload = {
    replyToken: replyToken,
    messages: [{ type: 'text', text: text }]
  };

  UrlFetchApp.fetch(LINE_REPLY_ENDPOINT, {
    method: 'post',
    contentType: 'application/json',
    headers: { Authorization: 'Bearer ' + token },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });
}
