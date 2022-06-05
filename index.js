const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const client = new Client({
    authStrategy: new LocalAuth()
});
const qrcode = require('qrcode-terminal');
const axios = require('axios');
const media = MessageMedia.fromFilePath('img/pap/1.jpg');

client.on('ready', () => {
    console.log('Client is Connected!');
});

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('message', message => {
	let TiktokLink = message.body.split(' ').pop();
	let Kota = message.body.split(' ').pop();

	if (message.body == 'Ayat Kursi') { // Ayat Kursi
		let url = "https://api.akuari.my.id/islami/ayatkursi";
		axios.get(url).then(function (res) {
			let ayat = "Ayat Kursi, arabic \n\n" + res.data.result.arabic + "\n\n Latin: \n\n" + res.data.result.latin
 			message.reply(ayat)
		})
	} else if (message.body == '.tiktok ' + TiktokLink) { // Tiktok Downloader
		let url = "https://api.akuari.my.id/downloader/tiktok?link=" + TiktokLink
		axios.get(url).then(function (res) {
			let tiktok = "Link Download: \n\n" + res.data.result.nowm
			message.reply(tiktok)
		})
	} else if (message.body == 'sholat ' + Kota){ // Jadwal Sholat
		let url = "https://zenzapis.xyz/islami/jadwalshalat?kota=" + Kota + "&apikey=53a5c72ab7";
		axios.get(url).then(function (res){
			message.reply(res.data.result)
		})
	} else {
		let url = "https://skybot.vercel.app/api/app?msg=" + message.body;
		const encodedURI = encodeURI(url);
		axios.get(encodedURI).then(function (res) {
			if (res.data.photo) {
				client.sendMessage(message.from, media, {caption: 'Nih ayang..😊'});
			} else {
				message.reply(res.data.ayang);
			}	
		}).catch(function (error) {
			console.log('Ada kesalahan request');
		});
	}
});

client.initialize();