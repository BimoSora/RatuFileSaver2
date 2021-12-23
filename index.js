require('dotenv').config()
const { Telegraf } = require('telegraf')
const crypto = require('crypto')
const config = require('./config.js')
const bot = new Telegraf(config.TOKEN)

config.TZ = "Asia/Jakarta";

//database
const db = require('./config/connection')
const collection = require('./config/collection')
const saver = require('./database/filesaver')
const helpcommand = require('./help.js')

//DATABASE CONNECTION 
db.connect((err) => {
    if(err) { console.log('error connection db' + err); }
    else { console.log('db connected'); }
})

//ID Channel/Group
const channelId = `${config.CHANNELJOIN}`;

function today(ctx){
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    var hours = today.getHours();
    var minutes = today.getMinutes();
    var seconds = today.getSeconds();
    return today = mm + '/' + dd + '/' + yyyy + ' ' + hours + ':' + minutes + ':' + seconds;
}

function today2(ctx){
    var today2 = new Date();
    var dd2 = String(today2.getDate()).padStart(2, '0');
    var mm2 = String(today2.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy2 = today2.getFullYear();
    var hours2 = today2.getHours();
    var minutes2 = today2.getMinutes();
    var seconds2 = today2.getSeconds();
    return today2 = mm2 + '/' + dd2 + '/' + yyyy2 + '-' + hours2 + ':' + minutes2 + ':' + seconds2;
}

//Function
function first_name(ctx){
    return `${ctx.from.first_name ? ctx.from.first_name : ""}`;
}
function last_name(ctx){
    return `${ctx.from.last_name ? ctx.from.last_name : ""}`;
}
function username(ctx){
    return ctx.from.username ? `@${ctx.from.username}` : "";
}
function fromid(ctx){
    return ctx.from.id ? `[${ctx.from.id}]` : "";
}
function captionbuild(ctx){
    return `${config.CAPTIONLINK}`;
}
function welcomejoin(ctx){
    return `${config.WELCOMEJOINBOT}\n\n${today(ctx)}`;
}
function messagewelcome(ctx){
    return `${config.MESSAGEWELCOMEBOT}\n\n${today(ctx)}`;
}
function messagebanned(ctx){
    return `⚠ YOU ARE BLOCKED FOR ABUSE OF A BOTT, CALL THE ADMIN FOR APPEAL.`;
}
function messagebotnoaddgroup(ctx){
    return `The bot has not entered the owner's channel/group.`;
}
function messagelink(ctx){
    return `Send bot videos, photos and documents.`;
}
function documentation(ctx){
    var mykey = crypto.createDecipher('aes-128-cbc', 'mypassword');
    var mystr = mykey.update('d59f19294f388d2ee23e350f913a84ba7abf661a3d2f09062ce5e927f0d644429d835186bec83190988e6941287f8ddce229e2f98ad520d6014ae1f21ffd4d71', 'hex', 'utf8')
    mystr += mykey.final('utf8');
    return `The bot was created using \n<b>Program:</b> Node JS \n<b>API:</b> <a href='https://telegraf.js.org/'>Telegraph</a> \n\n~ ${mystr} ~`;
}

const url2 = config.LINKCHANNEL.split(/[\,-]+/);
const url3 = url2[0];
const url4 = url2[1];

// inline keyboard
const inKey = [
    [{text:'📎 Tautan',callback_data:'POP'}],
    [{text:'📚 Dokumentasi',callback_data:'DOC'},{text:'🆘 Bantuan',callback_data:'HELP'}],
    [{text:'💿 Source code',callback_data:'SRC'}],
    [{text: `${url3}`, url: `${url4}`}]
];

const inKey2 = [
    [{text: `${url3}`, url: `${url4}`}]
];

//BOT START
bot.start(async(ctx, next)=>{
    await new Promise((resolve, reject) =>{
        setTimeout(()=>{
            return resolve("Result");
        }, 1_000);
    });

    if(ctx.chat.type == 'private') {
        msg = ctx.message.text
        let msgArray = msg.split(' ')
        //console.log(msgArray.length);
        let length = msgArray.length
        msgArray.shift()
        let query = msgArray.join(' ')
    
         user = {
            first_name:ctx.from.first_name,
            userId:ctx.from.id
        }
        if(ctx.from.id == config.ADMIN || ctx.from.id == config.ADMIN1 || ctx.from.id == config.ADMIN2){
            //welcoming message on /start and ifthere is a query available we can send files
            if(length == 1){
                await ctx.deleteMessage()
                const profile = await bot.telegram.getUserProfilePhotos(ctx.from.id)
                if(!profile || profile.total_count == 0)
                    return await ctx.reply(`<a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n\n${messagewelcome(ctx)}`,{
                        parse_mode:'HTML',
                        disable_web_page_preview: true,
                        reply_markup:{
                            inline_keyboard:inKey
                        }
                    })
                    await ctx.replyWithPhoto(profile.photos[0][0].file_id,{caption: `<a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n\n${messagewelcome(ctx)}`,
                        parse_mode:'HTML',
                        disable_web_page_preview: true,
                        reply_markup:{
                            inline_keyboard:inKey
                        }
                    })
            }else{
                if (query.indexOf('grp_') > -1){
                    let query1 = query.replace('grp_','');
                    try{
                        const res1 = await saver.getFile1(query1)
                            let mediagroup = [];
                            for (let index = 0; index < res1.length; index++) {
                            const data = res1[index];
                            mediagroup.push({type: data.type, media: data.file_id, caption: data.caption, parse_mode:'HTML'});
                        }
                    
                        async function captionFunction() {
                            return await ctx.reply(`${captionbuild(ctx)}`,{
                                parse_mode:'HTML'
                            })
                        }
                        await ctx.deleteMessage()
                        await ctx.telegram.sendMediaGroup(ctx.chat.id, mediagroup);
                        setTimeout(captionFunction, 1000)
                    }catch(error){
                        await ctx.deleteMessage()
                        await ctx.reply(`Media not found or has been removed.`)
                    }
                }else{
                    let query2 = query;
                    try{
                        const res2 = await saver.getFile2(query2)
                    
                        async function captionFunction2() {
                            await ctx.reply(`${captionbuild(ctx)}`,{
                                parse_mode:'HTML'
                            })
                        }
                        if(res2.type=='video'){
                            await ctx.deleteMessage()
                            if(!res2.caption) {
                                setTimeout(captionFunction2, 1000)
                                return await ctx.replyWithVideo(res2.file_id);
                            }
                            await ctx.replyWithVideo(res2.file_id,{caption: `${res2.caption}`,
                                parse_mode:'HTML'
                            });
                                setTimeout(captionFunction2, 1000)
                        }else if(res2.type=='photo'){
                            await ctx.deleteMessage()
                            if(!res2.caption) {
                                setTimeout(captionFunction2, 1000)
                                return await ctx.replyWithPhoto(res2.file_id);
                            }
                            await ctx.replyWithPhoto(res2.file_id,{caption: `${res2.caption}`,
                                parse_mode:'HTML'
                            });
                                setTimeout(captionFunction2, 1000)
                        }else if(res2.type=='document'){
                            await ctx.deleteMessage()
                            if(!res2.caption) {
                                setTimeout(captionFunction2, 1000)
                                return await ctx.replyWithDocument(res2.file_id);
                            }
                            await ctx.replyWithDocument(res2.file_id,{caption: `${res2.caption}`,
                                parse_mode:'HTML'
                            })
                                setTimeout(captionFunction2, 1000)
                        }
                    }catch(error){
                        await ctx.deleteMessage()
                        await ctx.reply(`Media not found or has been removed.`)
                    }
                }
            }
        }else{
            try {
                var botStatus = await bot.telegram.getChatMember(channelId, ctx.botInfo.id)
                var member = await bot.telegram.getChatMember(channelId, ctx.from.id)
                //console.log(member);
                if(member.status == 'restricted' || member.status == 'left' || member.status == 'kicked'){
                    const profile2 = await bot.telegram.getUserProfilePhotos(ctx.from.id)
                    await saver.checkBan(`${ctx.from.id}`).then(async res => {
                        //console.log(res);
                        if(res == true) {
                            if(ctx.chat.type == 'private') {
                                await ctx.deleteMessage()
                                await ctx.reply(`${messagebanned(ctx)}`)
                            }
                        }else{
                            ctx.deleteMessage()
                            if(!profile2 || profile2.total_count == 0)
                                return await ctx.reply(`<a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n\n${welcomejoin(ctx)}`,{
                                    parse_mode:'HTML',
                                    disable_web_page_preview: true,
                                    reply_markup:{
                                        inline_keyboard:inKey2
                                    }
                                })
                                await ctx.replyWithPhoto(profile2.photos[0][0].file_id,{caption: `<a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n\n${welcomejoin(ctx)}`,
                                    parse_mode:'HTML',
                                    disable_web_page_preview: true,
                                    reply_markup:{
                                        inline_keyboard:inKey2
                                    }
                                })
                        }
                    })
                }else{
                    //welcoming message on /start and ifthere is a query available we can send files
                    if(length == 1){
                        const profile3 = await bot.telegram.getUserProfilePhotos(ctx.from.id)
                            await saver.checkBan(`${ctx.from.id}`).then(async res => {
                                //console.log(res);
                                if(res == true) {
                                    if(ctx.chat.type == 'private') {
                                        await ctx.deleteMessage()
                                        await ctx.reply(`${messagebanned(ctx)}`)
                                    }
                                }else{
                                    await ctx.deleteMessage()
                                    if(!profile3 || profile3.total_count == 0)
                                        return await ctx.reply(`<a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n\n${messagewelcome(ctx)}`,{
                                            parse_mode:'HTML',
                                            disable_web_page_preview: true,
                                            reply_markup:{
                                                inline_keyboard:inKey
                                            }
                                        })
                                        await ctx.replyWithPhoto(profile3.photos[0][0].file_id,{caption: `<a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n\n${messagewelcome(ctx)}`,
                                            parse_mode:'HTML',
                                            disable_web_page_preview: true,
                                            reply_markup:{
                                                inline_keyboard:inKey
                                            }
                                        })
                                }
                            })
                        }else{
                            if (query.indexOf('grp_') > -1){
                                let query1 = query.replace('grp_','');
                                try{
                                    const res1 = await saver.getFile1(query1)
                                        let mediagroup = [];
                                        for (let index = 0; index < res1.length; index++) {
                                        const data = res1[index];
                                        mediagroup.push({type: data.type, media: data.file_id, caption: data.caption, parse_mode:'HTML'});
                                    }
                                
                                    async function captionFunction() {
                                        return await ctx.reply(`${captionbuild(ctx)}`,{
                                            parse_mode:'HTML'
                                        })
                                    }
                                    await saver.checkBan(`${ctx.from.id}`).then(async res => {
                                        //console.log(res);
                                        if(res == true) {
                                            await ctx.deleteMessage()
                                            if(ctx.chat.type == 'private') {
                                                await ctx.deleteMessage()
                                                await ctx.reply(`${messagebanned(ctx)}`)
                                            }
                                        }else{
                                            await ctx.deleteMessage()
                                            await ctx.telegram.sendMediaGroup(ctx.chat.id, mediagroup);
                                            setTimeout(captionFunction, 1000)
                                        }
                                    })
                                }catch(error){
                                    await saver.checkBan(`${ctx.from.id}`).then(async res => {
                                        //console.log(res);
                                        if(res == true) {
                                            if(ctx.chat.type == 'private') {
                                                await ctx.deleteMessage()
                                                await ctx.reply(`${messagebanned(ctx)}`)
                                            }
                                        }else{
                                            await ctx.deleteMessage()
                                            await ctx.reply(`Media not found or has been removed.`)
                                        }
                                    })
                                }
                            }else{
                                let query2 = query;
                                try{
                                    const res2 = await saver.getFile2(query2)
                                
                                    async function captionFunction2() {
                                        await ctx.reply(`${captionbuild(ctx)}`,{
                                            parse_mode:'HTML'
                                        })
                                    }
                                    await saver.checkBan(`${ctx.from.id}`).then(async res => {
                                        //console.log(res);
                                        if(res == true) {
                                            if(ctx.chat.type == 'private') {
                                                await ctx.deleteMessage()
                                                await ctx.reply(`${messagebanned(ctx)}`)
                                            }
                                        }else{
                                            if(res2.type=='video'){
                                                await ctx.deleteMessage()
                                                if(!res2.caption) {
                                                    setTimeout(captionFunction2, 1000)
                                                    return ctx.replyWithVideo(res2.file_id);
                                                }
                                                await ctx.replyWithVideo(res2.file_id,{caption: `${res2.caption}`,
                                                    parse_mode:'HTML'
                                                });
                                                    setTimeout(captionFunction2, 1000)
                                            }else if(res2.type=='photo'){
                                                await ctx.deleteMessage()
                                                if(!res2.caption) {
                                                    setTimeout(captionFunction2, 1000)
                                                    return await ctx.replyWithPhoto(res2.file_id);
                                                }
                                                await ctx.replyWithPhoto(res2.file_id,{caption: `${res2.caption}`,
                                                    parse_mode:'HTML'
                                                });
                                                    setTimeout(captionFunction2, 1000)
                                            }else if(res2.type=='document'){
                                                await ctx.deleteMessage()
                                                if(!res2.caption) {
                                                    setTimeout(captionFunction2, 1000)
                                                    return await ctx.replyWithDocument(res2.file_id);
                                                }
                                                await ctx.replyWithDocument(res2.file_id,{caption: `${res2.caption}`,
                                                    parse_mode:'HTML'
                                                })
                                                    setTimeout(captionFunction2, 1000)
                                            }
                                        }
                                    })
                                }catch(error){
                                    await saver.checkBan(`${ctx.from.id}`).then(async res => {
                                        //console.log(res);
                                        if(res == true) {
                                            if(ctx.chat.type == 'private') {
                                                await ctx.deleteMessage()
                                                await ctx.reply(`${messagebanned(ctx)}`)
                                            }
                                        }else{
                                            await ctx.deleteMessage()
                                            await ctx.reply(`Media not found or has been removed.`)
                                        }
                                    })
                                }
                            }
                        }
                    }
                }
            catch(error){
                await ctx.deleteMessage()
                await ctx.reply(`${messagebotnoaddgroup(ctx)}`)
            }
        }
        //saving user details to the database
        await saver.saveUser(user)
    }
    return next();
})

//DEFINING POP CALLBACK
bot.action('POP', async(ctx, next)=>{
    await new Promise((resolve, reject) =>{
        setTimeout(()=>{
            return resolve("Result");
        }, 1_000);
    });
    
    await ctx.deleteMessage()
    await ctx.reply(`${messagelink(ctx)}`,{
        parse_mode: 'HTML',
        reply_markup:{
            inline_keyboard: [
                [{text:'Batal',callback_data:'STARTUP'}]
            ]
        }
    })
    return next();
})

//DEFINING DOC CALLBACK
bot.action('DOC', async(ctx, next)=>{
    await new Promise((resolve, reject) =>{
        setTimeout(()=>{
            return resolve("Result");
        }, 1_000);
    });
    
    await ctx.deleteMessage()
    await ctx.reply(`${documentation(ctx)}`,{
        parse_mode: 'HTML',
        reply_markup:{
            inline_keyboard: [
                [{text:'Kembali',callback_data:'STARTUP'}]
            ]
        }
    })
    return next();
})

bot.action('SRC', async(ctx, next)=>{
    await new Promise((resolve, reject) =>{
        setTimeout(()=>{
            return resolve("Result");
        }, 1_000);
    });
    
    await ctx.deleteMessage()
    await ctx.reply(`${helpcommand.botsrc}`,{
        parse_mode: 'HTML',
        reply_markup:{
            inline_keyboard: [
                [{text: `💿 HEROKU`, url: `https://bit.ly/3yA6IRA`},{text: `💿 KOMPUTER/VPS`, url: `https://bit.ly/38qaMsS`}],
                [{text:'Kembali',callback_data:'STARTUP'}]
            ]
        }
    })
    return next();
})

bot.action('HELP',async(ctx, next)=>{
    await new Promise((resolve, reject) =>{
        setTimeout(()=>{
            return resolve("Result");
        }, 1_000);
    });
    
    await ctx.deleteMessage()
    await ctx.reply(`${helpcommand.bothelp}`,{
        parse_mode: 'HTML',
        disable_web_page_preview: true,
        reply_markup:{
            inline_keyboard: [
                [{text:'🪒 Perintah',callback_data:'COMM'}],
                [{text:'Kembali',callback_data:'STARTUP'}]
            ]
        }
    })
    return next();
})

bot.action('COMM', async(ctx, next)=>{
    await new Promise((resolve, reject) =>{
        setTimeout(()=>{
            return resolve("Result");
        }, 1_000);
    });
    
    await ctx.deleteMessage()
    await ctx.reply(`${helpcommand.botcommand}`,{
        parse_mode: 'HTML',
        disable_web_page_preview: true,
        reply_markup:{
            inline_keyboard: [
                [{text:'Kembali',callback_data:'HELP'}]
            ]
        }
    })
    return next();
})

bot.action('STARTUP', async(ctx, next)=>{
    await new Promise((resolve, reject) =>{
        setTimeout(()=>{
            return resolve("Result");
        }, 1_000);
    });

    await ctx.deleteMessage()
    const profile = await bot.telegram.getUserProfilePhotos(ctx.from.id)
    if(!profile || profile.total_count == 0)
        return await ctx.reply(`<a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n\n${messagewelcome(ctx)}`,{
            parse_mode:'HTML',
            disable_web_page_preview: true,
            reply_markup:{
                inline_keyboard:inKey
            }
        })
        await ctx.replyWithPhoto(profile.photos[0][0].file_id,{caption: `<a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n\n${messagewelcome(ctx)}`,
            parse_mode:'HTML',
            disable_web_page_preview: true,
            reply_markup:{
                inline_keyboard:inKey
            }
        })
    return next();
})

//TEST BOT
bot.hears(/ping/i,async(ctx, next)=>{
    await new Promise((resolve, reject) =>{
        setTimeout(()=>{
            return resolve("Result");
        }, 1_000);
    });
    
    if(ctx.chat.type == 'private') {    
        await saver.checkBan(`${ctx.from.id}`).then(async res => {
            //console.log(res);
            if(res == true) {
                if(ctx.chat.type == 'private') {
                    await ctx.deleteMessage()
                    await ctx.reply(`${messagebanned(ctx)}`)
                }
            }else{
                await ctx.deleteMessage()
                let chatId = ctx.message.from.id;
                let opts = {
                    reply_markup:{
                        inline_keyboard: [[{text:'OK',callback_data:'PONG'}]]
                    }
                }
                return await bot.telegram.sendMessage(chatId, 'pong' , opts);
            }
        })
    }
    return next();
})

bot.action('PONG',async(ctx, next)=>{
    await new Promise((resolve, reject) =>{
        setTimeout(()=>{
            return resolve("Result");
        }, 1_000);
    });
    
    await ctx.deleteMessage()
    return next();
})

//GROUP COMMAND
bot.command('reload',async(ctx, next)=>{
    await new Promise((resolve, reject) =>{
        setTimeout(()=>{
            return resolve("Result");
        }, 1_000);
    });
    
    var botStatus = await bot.telegram.getChatMember(ctx.chat.id, ctx.botInfo.id)
    var memberstatus = await bot.telegram.getChatMember(ctx.chat.id, ctx.from.id)
    //console.log(memberstatus);
    group = {
        groupId:ctx.chat.id
    }
    if(ctx.chat.type == 'group' || ctx.chat.type == 'supergroup') {
        if(memberstatus.status == 'creator' || memberstatus.status == 'administrator'){
            await ctx.deleteMessage()
            await ctx.reply('Bot restarted')
            await saver.saveGroup(group)
        }
        if(ctx.from.username == 'GroupAnonymousBot'){
            await ctx.deleteMessage()
            await ctx.reply('Bot restarted')
            await saver.saveGroup(group)
        }
    }
    return next();
})

bot.command('kick',async(ctx, next)=>{
    await new Promise((resolve, reject) =>{
        setTimeout(()=>{
            return resolve("Result");
        }, 1_000);
    });
    
    groupDetails = await saver.getGroup().then(async res=>{
        n = res.length
        groupId = []
        for (i = n-1; i >=0; i--) {
            groupId.push(res[i].groupId)
        }
        async function kick() {
            for (const group of groupId) {
                var botStatus = await bot.telegram.getChatMember(group, ctx.botInfo.id)
                var memberstatus = await bot.telegram.getChatMember(group, ctx.from.id)
                //console.log(memberstatus);

                if(ctx.chat.type == 'group' || ctx.chat.type == 'supergroup') {
                    if(memberstatus.status == 'administrator'){  
                        await ctx.deleteMessage()  
                        if(memberstatus.can_restrict_members == true){                
                            if(ctx.message.reply_to_message == undefined){
                                let args = ctx.message.text.split(" ").slice(1)
                                await bot.telegram.kickChatMember(ctx.chat.id, args[0]).then(async result =>{
                                    //console.log(result)
                                })
                            }
                            await bot.telegram.kickChatMember(ctx.chat.id, ctx.message.reply_to_message.from.id).then(async result =>{
                                //console.log(result)
                            })
                        }
                    }else if(memberstatus.status == 'creator'){
                        await ctx.deleteMessage()
                        if(ctx.message.reply_to_message == undefined){
                            let args = ctx.message.text.split(" ").slice(1)
                            await bot.telegram.kickChatMember(ctx.chat.id, args[0]).then(async result =>{
                                //console.log(result)
                            })
                        }
                        await bot.telegram.kickChatMember(ctx.chat.id, ctx.message.reply_to_message.from.id).then(async result =>{
                            //console.log(result)
                        })
                    }else{
                        if(ctx.from.username == 'GroupAnonymousBot'){
                            await ctx.deleteMessage()
                            if(ctx.message.reply_to_message == undefined){
                                let args = ctx.message.text.split(" ").slice(1)
                                await bot.telegram.kickChatMember(ctx.chat.id, args[0]).then(async result =>{
                                    //console.log(result)
                                })
                            }
                            await bot.telegram.kickChatMember(ctx.chat.id, ctx.message.reply_to_message.from.id).then(async result =>{
                                //console.log(result)
                            })
                        }
                    }
                }
            }
        }
        kick()
    })
    return next();
})

bot.command('ban',async(ctx, next)=>{
    await new Promise((resolve, reject) =>{
        setTimeout(()=>{
            return resolve("Result");
        }, 1_000);
    });
    
    groupDetails = await saver.getGroup().then(async res => {
        n = res.length
        groupId = []
        for (i = n-1; i >=0; i--) {
            groupId.push(res[i].groupId)
        }
        async function ban() {
            for (const group of groupId) {
                var botStatus = await bot.telegram.getChatMember(group, ctx.botInfo.id)
                var memberstatus = await bot.telegram.getChatMember(group, ctx.from.id)
                //console.log(memberstatus);

                if(ctx.chat.type == 'group' || ctx.chat.type == 'supergroup') {
                    if(memberstatus.status == 'administrator'){
                        await ctx.deleteMessage()
                        if(memberstatus.can_restrict_members == true){
                            if(ctx.message.reply_to_message == undefined){
                               const str = ctx.message.text;
                               const words = str.split(/ +/g);
                               const command = words.shift().slice(1);
                               const userId = words.shift();
                               const caption = words.join(" ");
                               const caption2 = caption ? `\n<b>Because:</b> ${caption}` : "";

                               await bot.telegram.callApi('banChatMember', {
                               chat_id: ctx.message.chat.id,
                               user_id: userId
                               }).then(async result =>{
                                   //console.log(result)
                                   await ctx.reply(`[${userId}] blocked. ${caption2}`,{
                                       parse_mode: 'HTML'
                                   })
                                   return await bot.telegram.sendMessage(userId, `You have been blocked on ${ctx.message.chat.title} ${caption2}`,{
                                       parse_mode: 'HTML'
                                   })
                               })
                            }
    
                            const str = ctx.message.text;
                            const words = str.split(/ +/g);
                            const command = words.shift().slice(1);
                            const userId = words.shift();
                            const caption = words.join(" ");
                            const caption2 = caption ? `\n<b>Because:</b> ${caption}` : "";
    
                            await bot.telegram.callApi('banChatMember', {
                            chat_id: ctx.message.chat.id,
                            user_id: ctx.message.reply_to_message.from.id
                            }).then(async result =>{
                                //console.log(result)
                                let replyUsername = ctx.message.reply_to_message.from.username ? `@${ctx.message.reply_to_message.from.username}` : `${ctx.message.reply_to_message.from.first_name}`;
                                let replyFromid = ctx.message.reply_to_message.from.id ? `[${ctx.message.reply_to_message.from.id}]` : "";
                                await ctx.reply(`${replyUsername} ${replyFromid} blocked. ${caption2}`,{
                                    parse_mode: 'HTML',
                                    reply_to_message_id: ctx.message.reply_to_message.message_id
                                })
                                return await bot.telegram.sendMessage(userId, `You have been blocked on ${ctx.message.chat.title} ${caption2}`,{
                                    parse_mode: 'HTML'
                                })
                            })
                        }
                    }else if(memberstatus.status == 'creator'){
                        await ctx.deleteMessage()
                        if(ctx.message.reply_to_message == undefined){
                            const str = ctx.message.text;
                            const words = str.split(/ +/g);
                            const command = words.shift().slice(1);
                            const userId = words.shift();
                            const caption = words.join(" ");
                            const caption2 = caption ? `\n<b>Because:</b> ${caption}` : "";

                            await bot.telegram.callApi('banChatMember', {
                            chat_id: ctx.message.chat.id,
                            user_id: userId
                            }).then(async result =>{
                                //console.log(result)
                                await ctx.reply(`[${userId}] blocked. ${caption2}`,{
                                    parse_mode: 'HTML'
                                })
                                return await bot.telegram.sendMessage(userId, `You have been blocked on ${ctx.message.chat.title} ${caption2}`,{
                                    parse_mode: 'HTML'
                                })
                            })
                        }

                        const str = ctx.message.text;
                        const words = str.split(/ +/g);
                        const command = words.shift().slice(1);
                        const userId = words.shift();
                        const caption = words.join(" ");
                        const caption2 = caption ? `\n<b>Because:</b> ${caption}` : "";

                        await bot.telegram.callApi('banChatMember', {
                        chat_id: ctx.message.chat.id,
                        user_id: ctx.message.reply_to_message.from.id
                        }).then(async result =>{
                            //console.log(result)
                            let replyUsername = ctx.message.reply_to_message.from.username ? `@${ctx.message.reply_to_message.from.username}` : `${ctx.message.reply_to_message.from.first_name}`;
                            let replyFromid = ctx.message.reply_to_message.from.id ? `[${ctx.message.reply_to_message.from.id}]` : "";
                            await ctx.reply(`${replyUsername} ${replyFromid} blocked. ${caption2}`,{
                                parse_mode: 'HTML',
                                reply_to_message_id: ctx.message.reply_to_message.message_id
                            })
                            return await bot.telegram.sendMessage(userId, `You have been blocked on ${ctx.message.chat.title} ${caption2}`,{
                                parse_mode: 'HTML'
                            })
                        })
                    }else{
                        if(ctx.from.username == 'GroupAnonymousBot'){
                            await ctx.deleteMessage()
                            if(ctx.message.reply_to_message == undefined){
                                const str = ctx.message.text;
                                const words = str.split(/ +/g);
                                const command = words.shift().slice(1);
                                const userId = words.shift();
                                const caption = words.join(" ");
                                const caption2 = caption ? `\n<b>Because:</b> ${caption}` : "";
    
                                await bot.telegram.callApi('banChatMember', {
                                chat_id: ctx.message.chat.id,
                                user_id: userId
                                }).then(async result =>{
                                    //console.log(result)
                                    await ctx.reply(`[${userId}] blocked. ${caption2}`,{
                                        parse_mode: 'HTML'
                                    })
                                    return await bot.telegram.sendMessage(userId, `You have been blocked on ${ctx.message.chat.title} ${caption2}`,{
                                        parse_mode: 'HTML'
                                    })
                                })
                            }
    
                            const str = ctx.message.text;
                            const words = str.split(/ +/g);
                            const command = words.shift().slice(1);
                            const userId = words.shift();
                            const caption = words.join(" ");
                            const caption2 = caption ? `\n<b>Because:</b> ${caption}` : "";
    
                            await bot.telegram.callApi('banChatMember', {
                            chat_id: ctx.message.chat.id,
                            user_id: ctx.message.reply_to_message.from.id
                            }).then(async result =>{
                                //console.log(result)
                                let replyUsername = ctx.message.reply_to_message.from.username ? `@${ctx.message.reply_to_message.from.username}` : `${ctx.message.reply_to_message.from.first_name}`;
                                let replyFromid = ctx.message.reply_to_message.from.id ? `[${ctx.message.reply_to_message.from.id}]` : "";
                                await ctx.reply(`${replyUsername} ${replyFromid} blocked. ${caption2}`,{
                                    parse_mode: 'HTML',
                                    reply_to_message_id: ctx.message.reply_to_message.message_id
                                })
                                return await bot.telegram.sendMessage(userId, `You have been blocked on ${ctx.message.chat.title} ${caption2}`,{
                                    parse_mode: 'HTML'
                                })
                            })
                        }
                    }
                }
            }
        }
        ban()
    })
    return next();
})

bot.command('unban',async(ctx, next)=>{
    await new Promise((resolve, reject) =>{
        setTimeout(()=>{
            return resolve("Result");
        }, 1_000);
    });
    
    groupDetails = await saver.getGroup().then(async res => {
        n = res.length
        groupId = []
        for (i = n-1; i >=0; i--) {
            groupId.push(res[i].groupId)
        }
        async function unban() {
            for (const group of groupId) {
                var botStatus = await bot.telegram.getChatMember(group, ctx.botInfo.id)
                var memberstatus = await bot.telegram.getChatMember(group, ctx.from.id)
                //console.log(memberstatus);

                if(ctx.chat.type == 'group' || ctx.chat.type == 'supergroup') {
                    if(memberstatus.status == 'administrator'){
                        await ctx.deleteMessage()
                        if(memberstatus.can_restrict_members == true){
                            if(ctx.message.reply_to_message == undefined){
                                let args = ctx.message.text.split(" ").slice(1)
                                await bot.telegram.unbanChatMember(ctx.chat.id, args[0]).then(async result =>{
                                    //console.log(result)
                                    await ctx.reply(`[${args[0]}] not blocked, can re-enter!`)
                                    return await bot.telegram.sendMessage(args[0], `You are not blocked, you can re-enter at ${ctx.message.chat.title}`)
                                })
                            }
                            await bot.telegram.unbanChatMember(ctx.chat.id, ctx.message.reply_to_message.from.id).then(async result =>{
                                //console.log(result)
                                let replyUsername = ctx.message.reply_to_message.from.username ? `@${ctx.message.reply_to_message.from.username}` : `${ctx.message.reply_to_message.from.first_name}`;
                                let replyFromid = ctx.message.reply_to_message.from.id ? `[${ctx.message.reply_to_message.from.id}]` : "";
                                await ctx.reply(`${replyUsername} ${replyFromid} not blocked, can re-enter!`,{
                                    reply_to_message_id: ctx.message.reply_to_message.message_id
                                })
                                return await bot.telegram.sendMessage(ctx.message.reply_to_message.from.id, `You are not blocked, you can re-enter at ${ctx.message.chat.title}`)
                            })
                        }
                    }else if(memberstatus.status == 'creator'){
                        await ctx.deleteMessage()
                        if(ctx.message.reply_to_message == undefined){
                            let args = ctx.message.text.split(" ").slice(1)
                            await bot.telegram.unbanChatMember(ctx.chat.id, args[0]).then(async result =>{
                                //console.log(result)
                                await ctx.reply(`[${args[0]}] not blocked, can re-enter!`)
                                return await bot.telegram.sendMessage(args[0], `You are not blocked, you can re-enter at ${ctx.message.chat.title}`)
                            })
                        }
                        await bot.telegram.unbanChatMember(ctx.chat.id, ctx.message.reply_to_message.from.id).then(async result =>{
                            //console.log(result)
                            let replyUsername = ctx.message.reply_to_message.from.username ? `@${ctx.message.reply_to_message.from.username}` : `${ctx.message.reply_to_message.from.first_name}`;
                            let replyFromid = ctx.message.reply_to_message.from.id ? `[${ctx.message.reply_to_message.from.id}]` : "";
                            await ctx.reply(`${replyUsername} ${replyFromid} not blocked, can re-enter!`,{
                                reply_to_message_id: ctx.message.reply_to_message.message_id
                            })
                            return await bot.telegram.sendMessage(ctx.message.reply_to_message.from.id, `You are not blocked, you can re-enter at ${ctx.message.chat.title}`)
                        })
                    }else{
                        if(ctx.from.username == 'GroupAnonymousBot'){
                            await ctx.deleteMessage()
                            if(ctx.message.reply_to_message == undefined){
                                let args = ctx.message.text.split(" ").slice(1)
                                await bot.telegram.unbanChatMember(ctx.chat.id, args[0]).then(async result =>{
                                    //console.log(result)
                                    await ctx.reply(`[${args[0]}] not blocked, can re-enter!`)
                                    return await bot.telegram.sendMessage(args[0], `You are not blocked, you can re-enter at ${ctx.message.chat.title}`)
                                })
                            }
                            await bot.telegram.unbanChatMember(ctx.chat.id, ctx.message.reply_to_message.from.id).then(async result =>{
                                //console.log(result)
                                let replyUsername = ctx.message.reply_to_message.from.username ? `@${ctx.message.reply_to_message.from.username}` : `${ctx.message.reply_to_message.from.first_name}`;
                                let replyFromid = ctx.message.reply_to_message.from.id ? `[${ctx.message.reply_to_message.from.id}]` : "";
                                await ctx.reply(`${replyUsername} ${replyFromid} not blocked, can re-enter!`,{
                                    reply_to_message_id: ctx.message.reply_to_message.message_id
                                })
                                return await bot.telegram.sendMessage(ctx.message.reply_to_message.from.id, `You are not blocked, you can re-enter at ${ctx.message.chat.title}`)
                            })
                        }
                    }
                }
            }
        }
        unban()
    })
    return next();
})

bot.command('pin',async(ctx, next)=>{
    await new Promise((resolve, reject) =>{
        setTimeout(()=>{
            return resolve("Result");
        }, 1_000);
    });
    
    groupDetails = await saver.getGroup().then(async res =>{
        n = res.length
        groupId = []
        for (i = n-1; i >=0; i--) {
            groupId.push(res[i].groupId)
        }
        async function pin() {
            for (const group of groupId) {
                var botStatus = await bot.telegram.getChatMember(group, ctx.botInfo.id)
                var memberstatus = await bot.telegram.getChatMember(group, ctx.from.id)
                //console.log(memberstatus);

                if(ctx.chat.type == 'group' || ctx.chat.type == 'supergroup') {
                    if(memberstatus.status == 'administrator'){
                        await ctx.deleteMessage()
                        if(memberstatus.can_pin_messages == true){
                            await bot.telegram.pinChatMessage(ctx.chat.id, ctx.message.reply_to_message.message_id,{
                                disable_notification: false,
                            }).then(async result =>{
                                //console.log(result)
                            })
                        }
                    }else if(memberstatus.status == 'creator'){
                        await ctx.deleteMessage()
                        await bot.telegram.pinChatMessage(ctx.chat.id, ctx.message.reply_to_message.message_id,{
                            disable_notification: false,
                        }).then(async result =>{
                            //console.log(result)
                        })
                    }else{
                        if(ctx.from.username == 'GroupAnonymousBot'){
                            await ctx.deleteMessage()
                            await bot.telegram.pinChatMessage(ctx.chat.id, ctx.message.reply_to_message.message_id,{
                                disable_notification: false,
                            }).then(async result =>{
                                //console.log(result)
                            })
                        }
                    }
                }
            }
        }
        pin()
    })
    return next();
})

bot.command('unpin',async(ctx, next)=>{
    await new Promise((resolve, reject) =>{
        setTimeout(()=>{
            return resolve("Result");
        }, 1_000);
    });
    
    groupDetails = await saver.getGroup().then( async res=>{
        n = res.length
        groupId = []
        for (i = n-1; i >=0; i--) {
            groupId.push(res[i].groupId)
        }
        async function unpin() {
            for (const group of groupId) {
                var botStatus = await bot.telegram.getChatMember(group, ctx.botInfo.id)
                var memberstatus = await bot.telegram.getChatMember(group, ctx.from.id)
                //console.log(memberstatus);

                if(ctx.chat.type == 'group' || ctx.chat.type == 'supergroup') {
                    if(memberstatus.status == 'administrator'){
                        await ctx.deleteMessage()
                        if(memberstatus.can_pin_messages == true){
                            await bot.telegram.unpinChatMessage(ctx.chat.id, ctx.message.reply_to_message.message_id).then(async result =>{
                                //console.log(result)
                            })
                        }
                    }else if(memberstatus.status == 'creator'){
                        await ctx.deleteMessage()
                        await bot.telegram.unpinChatMessage(ctx.chat.id, ctx.message.reply_to_message.message_id).then(async result =>{
                            //console.log(result)
                        })
                    }else{
                        if(ctx.from.username == 'GroupAnonymousBot'){
                            await ctx.deleteMessage()
                            await bot.telegram.unpinChatMessage(ctx.chat.id, ctx.message.reply_to_message.message_id).then(async result =>{
                                //console.log(result)
                            })
                        }
                    }
                }
            }
        }
        unpin()
    })
    return next();
})

bot.command('send',async(ctx, next)=>{
    await new Promise((resolve, reject) =>{
        setTimeout(()=>{
            return resolve("Result");
        }, 1_000);
    });
    
    groupDetails = await saver.getGroup().then(async res =>{
        n = res.length
        groupId = []
        for (i = n-1; i >=0; i--) {
            groupId.push(res[i].groupId)
        }
        async function send() {
            for (const group of groupId) {
                var botStatus = await bot.telegram.getChatMember(group, ctx.botInfo.id)
                var memberstatus = await bot.telegram.getChatMember(group, ctx.from.id)
                //console.log(memberstatus);

                if(ctx.chat.type == 'group' || ctx.chat.type == 'supergroup') {
                    if(memberstatus.status == 'creator' || memberstatus.status == 'administrator'){
                        await ctx.deleteMessage()
                        if(ctx.message.reply_to_message == undefined){
                            const str = ctx.message.text;
                            const words = str.split(/ +/g);
                            const command = words.shift().slice(1);
                            const caption = words.join(" ");
    
                            return await bot.telegram.sendMessage(group, `${caption}`)
                        }
                        const str = ctx.message.text;
                        const words = str.split(/ +/g);
                        const command = words.shift().slice(1);
                        const caption = words.join(" ");

                        return await bot.telegram.sendMessage(group, `${caption}`,{
                            reply_to_message_id: ctx.message.reply_to_message.message_id
                        })
                    }
                    if(ctx.from.username == 'GroupAnonymousBot'){
                        await ctx.deleteMessage()
                        if(ctx.message.reply_to_message == undefined){
                            const str = ctx.message.text;
                            const words = str.split(/ +/g);
                            const command = words.shift().slice(1);
                            const caption = words.join(" ");
    
                            return await bot.telegram.sendMessage(group, `${caption}`)
                        }
                        const str = ctx.message.text;
                        const words = str.split(/ +/g);
                        const command = words.shift().slice(1);
                        const caption = words.join(" ");

                        return await bot.telegram.sendMessage(group, `${caption}`,{
                            reply_to_message_id: ctx.message.reply_to_message.message_id
                        })
                    }
                }
            }
        }
        send()
    })
    return next();
})
//END

//check account
bot.command('getid',async(ctx, next)=>{
    await new Promise((resolve, reject) =>{
        setTimeout(()=>{
            return resolve("Result");
        }, 1_000);
    });
  
    if(ctx.chat.type == 'private') {       
        const profile4 = await bot.telegram.getUserProfilePhotos(ctx.from.id)
        await saver.checkBan(`${ctx.from.id}`).then(async res => {
            //console.log(res);
            if(res == true) {
                if(ctx.chat.type == 'private') {
                    await ctx.deleteMessage()
                    await ctx.reply(`${messagebanned(ctx)}`)
                }
            }else{
                if(!profile4 || profile4.total_count == 0){
                    await ctx.deleteMessage()
                    await ctx.reply(`<b>Name:</b> <a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n<b>Username:</b> ${username(ctx)}\n<b>ID:</b> ${ctx.from.id}`,{
                        parse_mode:'HTML'  
                    })
                }else{
                    await ctx.deleteMessage()
                    await ctx.replyWithPhoto(profile4.photos[0][0].file_id,{caption: `<b>Name:</b> <a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n<b>Username:</b> ${username(ctx)}\n<b>ID:</b> ${ctx.from.id}`,
                        parse_mode:'HTML'
                    })
                }
            }
        })
    }
    return next();
})

//remove files with file_id
bot.command('rem', async(ctx, next) => {
    await new Promise((resolve, reject) =>{
        setTimeout(()=>{
            return resolve("Result");
        }, 1_000);
    });

    if(ctx.chat.type == 'private') {
        msg = ctx.message.text
        let msgArray = msg.split(' ')
        msgArray.shift()
        let text2 = msgArray.join(' ')
        let text = `${text2}`.replace(/_/g, '-');
        console.log(text);
        if(ctx.from.id == config.ADMIN || ctx.from.id == config.ADMIN1 || ctx.from.id == config.ADMIN2){
            await ctx.deleteMessage()
            saver.removeFile(text)
            await ctx.reply('❌ 1 media deleted successfully')
        }
    }
    return next();
})

//remove whole collection(remove all files)
bot.command('clear', async(ctx, next)=>{
    await new Promise((resolve, reject) =>{
        setTimeout(()=>{
            return resolve("Result");
        }, 1_000);
    });

    if(ctx.chat.type == 'private') {
        if(ctx.from.id == config.ADMIN || ctx.from.id == config.ADMIN1 || ctx.from.id == config.ADMIN2){
            await ctx.deleteMessage()
            await saver.deleteCollection()
            await ctx.reply('❌ All media deleted successfully')
        }
    }
    return next();
})

//removing all files sent by a user
bot.command('remall', async(ctx, next) => {
    await new Promise((resolve, reject) =>{
        setTimeout(()=>{
            return resolve("Result");
        }, 1_000);
    });

    if(ctx.chat.type == 'private') {
        msg = ctx.message.text
        let msgArray = msg.split(' ')
        msgArray.shift()
        let text = msgArray.join(' ')
        //console.log(text);
        let id = parseInt(text)
        if(ctx.from.id == config.ADMIN || ctx.from.id == config.ADMIN1 || ctx.from.id == config.ADMIN2){
            await ctx.deleteMessage()
            await saver.removeUserFile(id)
            await ctx.reply('❌ Delete all user media successfully')
        }
    }
    return next();
})

bot.command('sendchat',async(ctx, next)=>{
    await new Promise((resolve, reject) =>{
        setTimeout(()=>{
            return resolve("Result");
        }, 1_000);
    });
    
    groupDetails = await saver.getGroup().then(async res=>{
        n = res.length
        groupId = []
        for (i = n-1; i >=0; i--) {
            groupId.push(res[i].groupId)
        }
        async function sendchat() {
            for (const group of groupId) {
                var memberstatus = await bot.telegram.getChatMember(group, ctx.from.id)
                //console.log(memberstatus);

                if(memberstatus.status == 'creator' || memberstatus.status == 'administrator'){
                    await ctx.deleteMessage()
                    const str = ctx.message.text;
                    const words = str.split(/ +/g);
                    const command = words.shift().slice(1);
                    const userId = words.shift();
                    const caption = words.join(" ");
                    await ctx.reply('Sent!',{
                        reply_to_message_id: ctx.message.message_id
                    })
                    return await bot.telegram.sendMessage(userId, `${caption}`)
                }
            }
        }

        if(ctx.chat.type == 'private') {
            if(ctx.from.id == config.ADMIN || ctx.from.id == config.ADMIN1 || ctx.from.id == config.ADMIN2){
                await ctx.deleteMessage()
                const str = ctx.message.text;
                const words = str.split(/ +/g);
                const command = words.shift().slice(1);
                const userId = words.shift();
                const caption = words.join(" ");
                await ctx.reply('Sent!',{
                    reply_to_message_id: ctx.message.message_id
                })

                return await bot.telegram.sendMessage(userId, `${caption}`)
            }
            sendchat()
        }
    })
    return next();
})

//broadcasting message to bot users(from last joined to first)
bot.command('broadcast',async(ctx, next)=>{
    await new Promise((resolve, reject) =>{
        setTimeout(()=>{
            return resolve("Result");
        }, 1_000);
    });
    
    if(ctx.chat.type == 'private') {
        msg = ctx.message.text
        let msgArray = msg.split(' ')
        msgArray.shift()
        let text = msgArray.join(' ')
        userDetails = await saver.getUser().then(async res =>{
            n = res.length
            userId = []
            for (i = n-1; i >=0; i--) {
                userId.push(res[i].userId)
            }

            //broadcasting
            totalBroadCast = 0
            totalFail = []

            //creating function for broadcasting and to know bot user status
            async function broadcast(text) {
                for (const users of userId) {
                    try {
                        await bot.telegram.sendMessage(users, String(text),{
                            parse_mode:'HTML',
                            disable_web_page_preview: true
                          }
                        )
                    } catch (err) {
                        await saver.updateUser(users)
                        totalFail.push(users)

                    }
                }
                await ctx.reply(`✅ <b>Number of active users:</b> ${userId.length - totalFail.length}\n❌ <b>Total failed broadcasts:</b> ${totalFail.length}`,{
                    parse_mode:'HTML'
                })

            }
            if(ctx.from.id == config.ADMIN || ctx.from.id == config.ADMIN1 || ctx.from.id == config.ADMIN2){
                await ctx.deleteMessage()
                broadcast(text)
                await ctx.reply('Broadcast starts (Message is broadcast from last joined to first).')

            }else{
                await ctx.deleteMessage()
                await ctx.reply(`Commands can only be used by Admin.`) 
            }

        })
    }
    return next();
})

//ban user with user id
bot.command('banchat', async(ctx, next) => {
    await new Promise((resolve, reject) =>{
        setTimeout(()=>{
            return resolve("Result");
        }, 1_000);
    });
    
    if(ctx.chat.type == 'private') {
        msg = ctx.message.text
        let msgArray = msg.split(' ')
        msgArray.shift()
        let text = msgArray.join(' ')
        //console.log(text)
        userId = {
            id: text
        }

        if(ctx.chat.type == 'private') {
            if(ctx.from.id == config.ADMIN|| ctx.from.id == config.ADMIN1 || ctx.from.id == config.ADMIN2){
                await ctx.deleteMessage()
                await saver.banUser(userId).then(async res => {
                    await ctx.reply('❌ Banned')
                })
            }
        }
    }
    return next();
})

//unban user with user id
bot.command('unbanchat', async(ctx, next) => {
    await new Promise((resolve, reject) =>{
        setTimeout(()=>{
            return resolve("Result");
        }, 1_000);
    });
    
    if(ctx.chat.type == 'private') {
        msg = ctx.message.text
        let msgArray = msg.split(' ')
        msgArray.shift()
        let text = msgArray.join(' ')
        //console.log(text)
        userId = {
            id: text
        }

        if(ctx.chat.type == 'private') {
            if(ctx.from.id == config.ADMIN || ctx.from.id == config.ADMIN1 || ctx.from.id == config.ADMIN2){
                await ctx.deleteMessage()
                await saver.unBan(userId).then(async res => {
                    await ctx.reply('✅ Finished')
                })
            }
        }
    }
    return next();
})

//saving documents to db and generating link
bot.on('document', async(ctx, next) => {
    await new Promise((resolve, reject) =>{
        setTimeout(()=>{
            return resolve("Result");
        }, 2_000);
    });

    if(ctx.chat.type == 'private') {
        if(ctx.from.id == config.ADMIN || ctx.from.id == config.ADMIN1 || ctx.from.id == config.ADMIN2){
            document2 = ctx.message.document
            mediaId2 = ctx.message.media_group_id
            caption2 = ctx.message.caption
            
            if(mediaId2 == undefined){
                if(document2.file_name == undefined){
                    fileDetails1 = {
                        file_name: today2(ctx),
                        userId:ctx.from.id,
                        file_id: document2.file_id,
                        caption: caption2,
                        file_size: document2.file_size,
                        uniqueId: document2.file_unique_id,
                        type: 'document'
                    }
                }else{
                    var exstension = document2.file_name;
                    var regex = /\.[A-Za-z0-9]+$/gm
                    var doctext = exstension.replace(regex, '');
                    fileDetails2 = {
                        file_name: doctext,
                        userId:ctx.from.id,
                        file_id: document2.file_id,
                        caption: caption2,
                        file_size: document2.file_size,
                        uniqueId: document2.file_unique_id,
                        type: 'document'
                    }
                }
            }else{
                if(document2.file_name == undefined){
                    fileDetails3 = {
                        file_name: today2(ctx),
                        userId:ctx.from.id,
                        file_id: document2.file_id,
                        mediaId: mediaId2,
                        caption: caption2,
                        file_size: document2.file_size,
                        uniqueId: document2.file_unique_id,
                        type: 'document'
                    }
                }else{
                    var exstension2 = document2.file_name;
                    var regex2 = /\.[A-Za-z0-9]+$/gm
                    var doctext2 = exstension2.replace(regex2, '');
                    fileDetails4 = {
                        file_name: doctext2,
                        userId:ctx.from.id,
                        file_id: document2.file_id,
                        mediaId: mediaId2,
                        caption: caption2,
                        file_size: document2.file_size,
                        uniqueId: document2.file_unique_id,
                        type: 'document'
                    }
                }
            }

            if(mediaId2 == undefined){
                if(document2.file_name == undefined){
                    await saver.checkFile(`${fileDetails1.uniqueId}`).then(async res => {
                        //console.log(res);
                        if(res == true) {
                            await ctx.reply(`File sudah ada.`,{
                                reply_to_message_id: ctx.message.message_id
                            })
                        }else{
                            await saver.saveFile(fileDetails1)
                            await ctx.reply(`✔️ Document disimpan \n<b>Nama file:</b> ${fileDetails1.file_name}\n<b>Size:</b> ${fileDetails1.file_size} B\n<b>ID file:</b> ${fileDetails1.uniqueId}\n\nhttps://t.me/${config.BOTUSERNAME}?start=${fileDetails1.uniqueId}`,{
                                parse_mode: 'HTML',
                                disable_web_page_preview: true,
                                reply_to_message_id: ctx.message.message_id
                            })
                            if(caption2 == undefined)
                                return await ctx.replyWithDocument(fileDetails1.file_id, {
                                    chat_id: config.LOG_CHANNEL,
                                    caption: `✔️ Document disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails1.file_name}\n<b>Size:</b> ${fileDetails1.file_size} B\n<b>ID file:</b> ${fileDetails1.file_id}\n\nhttps://t.me/${config.BOTUSERNAME}?start=${fileDetails1.uniqueId}`,
                                    parse_mode:'HTML'
                                })
                                await ctx.replyWithDocument(fileDetails1.file_id, {
                                    chat_id: config.LOG_CHANNEL,
                                    caption: `${fileDetails1.caption}\n\n✔️ Document disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails1.file_name}\n<b>Size:</b> ${fileDetails1.file_size} B\n<b>ID file:</b> ${fileDetails1.file_id}\n\nhttps://t.me/${config.BOTUSERNAME}?start=${fileDetails1.uniqueId}`,
                                    parse_mode:'HTML'
                                })
                        }
                    })
                }else{
                    await saver.checkFile(`${fileDetails2.uniqueId}`).then(async res => {
                        //console.log(res);
                        if(res == true) {
                            await ctx.reply(`File sudah ada.`,{
                                reply_to_message_id: ctx.message.message_id
                            })
                        }else{
                            await saver.saveFile2(fileDetails2)
                            await ctx.reply(`✔️ Document disimpan \n<b>Nama file:</b> ${fileDetails2.file_name}\n<b>Size:</b> ${fileDetails2.file_size} B\n<b>ID file:</b> ${fileDetails2.uniqueId}\n\nhttps://t.me/${config.BOTUSERNAME}?start=${fileDetails2.uniqueId}`,{
                                parse_mode: 'HTML',
                                disable_web_page_preview: true,
                                reply_to_message_id: ctx.message.message_id
                            })
                            if(caption2 == undefined)
                                return await ctx.replyWithDocument(fileDetails2.file_id, {
                                    chat_id: config.LOG_CHANNEL,
                                    caption: `✔️ Document disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails2.file_name}\n<b>Size:</b> ${fileDetails2.file_size} B\n<b>ID file:</b> ${fileDetails2.file_id}\n\nhttps://t.me/${config.BOTUSERNAME}?start=${fileDetails2.uniqueId}`,
                                    parse_mode:'HTML'
                                })
                                await ctx.replyWithDocument(fileDetails2.file_id, {
                                    chat_id: config.LOG_CHANNEL,
                                    caption: `${fileDetails2.caption}\n\n✔️ Document disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails2.file_name}\n<b>Size:</b> ${fileDetails2.file_size} B\n<b>ID file:</b> ${fileDetails2.file_id}\n\nhttps://t.me/${config.BOTUSERNAME}?start=${fileDetails2.uniqueId}`,
                                    parse_mode:'HTML'
                                })
                        }
                    })
                }
            }else{
                if(document2.file_name == undefined){
                    await saver.checkFile(`${fileDetails3.uniqueId}`).then(async res => {
                        //console.log(res);
                        if(res == true) {
                            await ctx.reply(`File sudah ada.`,{
                                reply_to_message_id: ctx.message.message_id
                            })
                        }else{
                            await saver.saveFile3(fileDetails3)
                            await ctx.reply(`✔️ Grup disimpan \n<b>Nama file:</b> ${fileDetails3.file_name}\n<b>Size:</b> ${fileDetails3.file_size} B\n<b>ID file:</b> ${fileDetails3.uniqueId}\n<b>ID grup:</b> ${fileDetails3.mediaId}\n\nhttps://t.me/${config.BOTUSERNAME}?start=${fileDetails3.uniqueId}\nhttps://t.me/${config.BOTUSERNAME}?start=grp_${fileDetails3.mediaId}`,{
                                parse_mode: 'HTML',
                                disable_web_page_preview: true,
                                reply_to_message_id: ctx.message.message_id
                            })
                            if(caption2 == undefined)                   
                                return await ctx.replyWithDocument(fileDetails3.file_id, {
                                    chat_id: config.LOG_CHANNEL,
                                    caption: `✔️ Grup disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails3.file_name}\n<b>Size:</b> ${fileDetails3.file_size} B\n<b>ID file:</b> ${fileDetails3.file_id}\n<b>ID grup:</b> ${fileDetails3.mediaId}\n\nhttps://t.me/${config.BOTUSERNAME}?start=${fileDetails3.uniqueId}\nhttps://t.me/${config.BOTUSERNAME}?start=grp_${fileDetails3.mediaId}`,
                                    parse_mode:'HTML'
                                })
                                await ctx.replyWithDocument(fileDetails3.file_id, {
                                    chat_id: config.LOG_CHANNEL,
                                    caption: `${fileDetails3.caption}\n\n✔️ Grup disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails3.file_name}\n<b>Size:</b> ${fileDetails3.file_size} B\n<b>ID file:</b> ${fileDetails3.file_id}\n<b>ID grup:</b> ${fileDetails3.mediaId}\n\nhttps://t.me/${config.BOTUSERNAME}?start=grp_${fileDetails3.uniqueId}\nhttps://t.me/${config.BOTUSERNAME}?start=grp_${fileDetails3.mediaId}`,
                                    parse_mode:'HTML'
                                })
                        }
                    })
                }else{
                    await saver.checkFile(`${fileDetails4.uniqueId}`).then(async res => {
                        //console.log(res);
                        if(res == true) {
                            await ctx.reply(`File sudah ada.`,{
                                reply_to_message_id: ctx.message.message_id
                            })
                        }else{
                            await saver.saveFile4(fileDetails4)
                            await ctx.reply(`✔️ Grup disimpan \n<b>Nama file:</b> ${fileDetails4.file_name}\n<b>Size:</b> ${fileDetails4.file_size} B\n<b>ID file:</b> ${fileDetails4.uniqueId}\n<b>ID grup:</b> ${fileDetails4.mediaId}\n\nhttps://t.me/${config.BOTUSERNAME}?start=${fileDetails4.uniqueId}\nhttps://t.me/${config.BOTUSERNAME}?start=grp_${fileDetails4.mediaId}`,{
                                parse_mode: 'HTML',
                                disable_web_page_preview: true,
                                reply_to_message_id: ctx.message.message_id
                            })
                            if(caption2 == undefined)                   
                                return await ctx.replyWithDocument(fileDetails4.file_id, {
                                    chat_id: config.LOG_CHANNEL,
                                    caption: `✔️ Grup disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails4.file_name}\n<b>Size:</b> ${fileDetails4.file_size} B\n<b>ID file:</b> ${fileDetails4.file_id}\n<b>ID grup:</b> ${fileDetails4.mediaId}\n\nhttps://t.me/${config.BOTUSERNAME}?start=${fileDetails4.uniqueId}\nhttps://t.me/${config.BOTUSERNAME}?start=grp_${fileDetails4.mediaId}`,
                                    parse_mode:'HTML'
                                })
                                await ctx.replyWithDocument(fileDetails4.file_id, {
                                    chat_id: config.LOG_CHANNEL,
                                    caption: `${fileDetails4.caption}\n\n✔️ Grup disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails4.file_name}\n<b>Size:</b> ${fileDetails4.file_size} B\n<b>ID file:</b> ${fileDetails4.file_id}\n<b>ID grup:</b> ${fileDetails4.mediaId}\n\nhttps://t.me/${config.BOTUSERNAME}?start=${fileDetails4.uniqueId}\nhttps://t.me/${config.BOTUSERNAME}?start=grp_${fileDetails4.mediaId}`,
                                    parse_mode:'HTML'
                                })
                        }
                    })
                }
            }
        }else{
            var botStatus = await bot.telegram.getChatMember(channelId, ctx.botInfo.id)
            var member = await bot.telegram.getChatMember(channelId, ctx.from.id)
            //console.log(member);
            if(member.status == 'restricted' || member.status == 'left' || member.status == 'kicked'){
                const profile2 = await bot.telegram.getUserProfilePhotos(ctx.from.id)
                await saver.checkBan(`${ctx.from.id}`).then(async res => {
                    //console.log(res);
                    if(res == true) {
                        await ctx.reply(`${messagebanned(ctx)}`)
                    }else{
                        if(!profile2 || profile2.total_count == 0)
                        return await ctx.reply(`<a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n\n${welcomejoin(ctx)}`,{
                            parse_mode:'HTML',
                            disable_web_page_preview: true,
                            reply_markup:{
                                inline_keyboard:inKey2
                            }
                        })
                        await ctx.replyWithPhoto(profile2.photos[0][0].file_id,{caption: `<a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n\n${welcomejoin(ctx)}`,
                            parse_mode:'HTML',
                            disable_web_page_preview: true,
                            reply_markup:{
                                inline_keyboard:inKey2
                            }
                        })
                    }
                })
            }else{
                document3 = ctx.message.document
                mediaId3 = ctx.message.media_group_id
                caption3 = ctx.message.caption
        
                if(mediaId3 == undefined){
                    if(document3.file_name == undefined){
                        fileDetails1 = {
                            file_name: today2(ctx),
                            userId:ctx.from.id,
                            file_id: document3.file_id,
                            caption: caption3,
                            file_size: document3.file_size,
                            uniqueId: document3.file_unique_id,
                            type: 'document'
                        }
                    }else{
                        var exstension = document3.file_name;
                        var regex = /\.[A-Za-z0-9]+$/gm
                        var doctext = exstension.replace(regex, '');
                        fileDetails2 = {
                            file_name: doctext,
                            userId:ctx.from.id,
                            file_id: document3.file_id,
                            caption: caption3,
                            file_size: document3.file_size,
                            uniqueId: document3.file_unique_id,
                            type: 'document'
                        }
                    }
                }else{
                    if(document3.file_name == undefined){
                        fileDetails3 = {
                            file_name: today2(ctx),
                            userId:ctx.from.id,
                            file_id: document3.file_id,
                            mediaId: mediaId3,
                            caption: caption3,
                            file_size: document3.file_size,
                            uniqueId: document3.file_unique_id,
                            type: 'document'
                        }
                    }else{
                        var exstension2 = document3.file_name;
                        var regex2 = /\.[A-Za-z0-9]+$/gm
                        var doctext2 = exstension2.replace(regex2, '');
                        fileDetails4 = {
                            file_name: doctext2,
                            userId:ctx.from.id,
                            file_id: document3.file_id,
                            mediaId: mediaId3,
                            caption: caption3,
                            file_size: document3.file_size,
                            uniqueId: document3.file_unique_id,
                            type: 'document'
                        }
                    }
                }
            
                if(mediaId3 == undefined){
                    if(document3.file_name == undefined){
                        await saver.checkBan(`${ctx.from.id}`).then(async res => {
                            //console.log(res);
                            if(res == true) {
                                await ctx.reply(`${messagebanned(ctx)}`)
                            }else{
                                await saver.checkFile(`${fileDetails1.uniqueId}`).then(async res => {
                                    //console.log(res);
                                    if(res == true) {
                                        await ctx.reply(`File sudah ada.`,{
                                            reply_to_message_id: ctx.message.message_id
                                        })
                                    }else{
                                        await saver.saveFile(fileDetails1)
                                        await ctx.reply(`✔️ Document disimpan \n<b>Nama file:</b> ${fileDetails1.file_name}\n<b>Size:</b> ${fileDetails1.file_size} B\n<b>ID file:</b> ${fileDetails1.uniqueId}\n\nhttps://t.me/${config.BOTUSERNAME}?start=${fileDetails1.uniqueId}`,{
                                            parse_mode: 'HTML',
                                            disable_web_page_preview: true,
                                            reply_to_message_id: ctx.message.message_id
                                        })
                                        if(caption3 == undefined)
                                            return await ctx.replyWithDocument(fileDetails1.file_id, {
                                                chat_id: config.LOG_CHANNEL,
                                                caption: `✔️ Document disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails1.file_name}\n<b>Size:</b> ${fileDetails1.file_size} B\n<b>ID file:</b> ${fileDetails1.file_id}\n\nhttps://t.me/${config.BOTUSERNAME}?start=${fileDetails1.uniqueId}`,
                                                parse_mode:'HTML'
                                            })
                                            await ctx.replyWithDocument(fileDetails1.file_id, {
                                                chat_id: config.LOG_CHANNEL,
                                                caption: `${fileDetails1.caption}\n\n✔️ Document disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails1.file_name}\n<b>Size:</b> ${fileDetails1.file_size} B\n<b>ID file:</b> ${fileDetails1.file_id}\n\nhttps://t.me/${config.BOTUSERNAME}?start=${fileDetails1.uniqueId}`,
                                                parse_mode:'HTML'
                                            })
                                    }
                                })
                            }
                        })
                    }else{
                        await saver.checkBan(`${ctx.from.id}`).then(async res => {
                            //console.log(res);
                            if(res == true) {
                                await ctx.reply(`${messagebanned(ctx)}`)
                            }else{
                                await saver.checkFile(`${fileDetails2.uniqueId}`).then(async res => {
                                    //console.log(res);
                                    if(res == true) {
                                        await ctx.reply(`File sudah ada.`,{
                                            reply_to_message_id: ctx.message.message_id
                                        })
                                    }else{
                                        await saver.saveFile2(fileDetails2)
                                        await ctx.reply(`✔️ Document disimpan \n<b>Nama file:</b> ${fileDetails2.file_name}\n<b>Size:</b> ${fileDetails2.file_size} B\n<b>ID file:</b> ${fileDetails2.uniqueId}\n\nhttps://t.me/${config.BOTUSERNAME}?start=${fileDetails2.uniqueId}`,{
                                            parse_mode: 'HTML',
                                            disable_web_page_preview: true,
                                            reply_to_message_id: ctx.message.message_id
                                        })
                                        if(caption3 == undefined)
                                            return await ctx.replyWithDocument(fileDetails2.file_id, {
                                                chat_id: config.LOG_CHANNEL,
                                                caption: `✔️ Document disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails2.file_name}\n<b>Size:</b> ${fileDetails2.file_size} B\n<b>ID file:</b> ${fileDetails2.file_id}\n\nhttps://t.me/${config.BOTUSERNAME}?start=${fileDetails2.uniqueId}`,
                                                parse_mode:'HTML'
                                            })
                                            await ctx.replyWithDocument(fileDetails2.file_id, {
                                                chat_id: config.LOG_CHANNEL,
                                                caption: `${fileDetails2.caption}\n\n✔️ Document disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails2.file_name}\n<b>Size:</b> ${fileDetails2.file_size} B\n<b>ID file:</b> ${fileDetails2.file_id}\n\nhttps://t.me/${config.BOTUSERNAME}?start=${fileDetails2.uniqueId}`,
                                                parse_mode:'HTML'
                                            })
                                    }
                                })
                            }
                        })
                    }
                }else{
                    if(document3.file_name == undefined){
                        await saver.checkBan(`${ctx.from.id}`).then(async res => {
                            //console.log(res);
                            if(res == true) {
                                await ctx.reply(`${messagebanned(ctx)}`)
                            }else{
                                await saver.checkFile(`${fileDetails3.uniqueId}`).then(async res => {
                                    //console.log(res);
                                    if(res == true) {
                                        await ctx.reply(`File sudah ada.`,{
                                            reply_to_message_id: ctx.message.message_id
                                        })
                                    }else{
                                        await saver.saveFile3(fileDetails3)
                                        await ctx.reply(`✔️ Grup disimpan \n<b>Nama file:</b> ${fileDetails3.file_name}\n<b>Size:</b> ${fileDetails3.file_size} B\n<b>ID file:</b> ${fileDetails3.uniqueId}\n<b>ID grup:</b> ${fileDetails3.mediaId}\n\nhttps://t.me/${config.BOTUSERNAME}?start=${fileDetails3.uniqueId}\nhttps://t.me/${config.BOTUSERNAME}?start=grp_${fileDetails3.mediaId}`,{
                                            parse_mode: 'HTML',
                                            disable_web_page_preview: true,
                                            reply_to_message_id: ctx.message.message_id
                                        })
                                        if(caption3 == undefined)                   
                                            return await ctx.replyWithDocument(fileDetails3.file_id, {
                                                chat_id: config.LOG_CHANNEL,
                                                caption: `✔️ Grup disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails3.file_name}\n<b>Size:</b> ${fileDetails3.file_size} B\n<b>ID file:</b> ${fileDetails3.file_id}\n<b>ID grup:</b> ${fileDetails3.mediaId}\n\nhttps://t.me/${config.BOTUSERNAME}?start=${fileDetails3.uniqueId}\nhttps://t.me/${config.BOTUSERNAME}?start=grp_${fileDetails3.mediaId}`,
                                                parse_mode:'HTML'
                                            })
                                            await ctx.replyWithDocument(fileDetails3.file_id, {
                                                chat_id: config.LOG_CHANNEL,
                                                caption: `${fileDetails3.caption}\n\n✔️ Grup disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails3.file_name}\n<b>Size:</b> ${fileDetails3.file_size} B\n<b>ID file:</b> ${fileDetails3.file_id}\n<b>ID grup:</b> ${fileDetails3.mediaId}\n\nhttps://t.me/${config.BOTUSERNAME}?start=grp_${fileDetails3.uniqueId}\nhttps://t.me/${config.BOTUSERNAME}?start=grp_${fileDetails3.mediaId}`,
                                                parse_mode:'HTML'
                                            })
                                    }
                                })
                            }
                        })
                    }else{
                        await saver.checkBan(`${ctx.from.id}`).then(async res => {
                            //console.log(res);
                            if(res == true) {
                                await ctx.reply(`${messagebanned(ctx)}`)
                            }else{
                                await saver.checkFile(`${fileDetails4.uniqueId}`).then(async res => {
                                    //console.log(res);
                                    if(res == true) {
                                        await ctx.reply(`File sudah ada.`,{
                                            reply_to_message_id: ctx.message.message_id
                                        })
                                    }else{
                                        await saver.saveFile4(fileDetails4)
                                        await ctx.reply(`✔️ Grup disimpan \n<b>Nama file:</b> ${fileDetails4.file_name}\n<b>Size:</b> ${fileDetails4.file_size} B\n<b>ID file:</b> ${fileDetails4.uniqueId}\n<b>ID grup:</b> ${fileDetails4.mediaId}\n\nhttps://t.me/${config.BOTUSERNAME}?start=${fileDetails4.uniqueId}\nhttps://t.me/${config.BOTUSERNAME}?start=grp_${fileDetails4.mediaId}`,{
                                            parse_mode: 'HTML',
                                            disable_web_page_preview: true,
                                            reply_to_message_id: ctx.message.message_id
                                        })
                                        if(caption3 == undefined)                   
                                            return await ctx.replyWithDocument(fileDetails4.file_id, {
                                                chat_id: config.LOG_CHANNEL,
                                                caption: `✔️ Grup disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails4.file_name}\n<b>Size:</b> ${fileDetails4.file_size} B\n<b>ID file:</b> ${fileDetails4.file_id}\n<b>ID grup:</b> ${fileDetails4.mediaId}\n\nhttps://t.me/${config.BOTUSERNAME}?start=${fileDetails4.uniqueId}\nhttps://t.me/${config.BOTUSERNAME}?start=grp_${fileDetails4.mediaId}`,
                                                parse_mode:'HTML'
                                            })
                                            await ctx.replyWithDocument(fileDetails4.file_id, {
                                                chat_id: config.LOG_CHANNEL,
                                                caption: `${fileDetails4.caption}\n\n✔️ Grup disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails4.file_name}\n<b>Size:</b> ${fileDetails4.file_size} B\n<b>ID file:</b> ${fileDetails4.file_id}\n<b>ID grup:</b> ${fileDetails4.mediaId}\n\nhttps://t.me/${config.BOTUSERNAME}?start=${fileDetails4.uniqueId}\nhttps://t.me/${config.BOTUSERNAME}?start=grp_${fileDetails4.mediaId}`,
                                                parse_mode:'HTML'
                                            })
                                    }
                                })
                            }
                        })
                    }
                }
            }
        }
    }
    return next();
})

//video files
bot.on('video', async(ctx, next) => {
    await new Promise((resolve, reject) =>{
        setTimeout(()=>{
            return resolve("Result");
        }, 2_000);
    });

    if(ctx.chat.type == 'private') {
        if(ctx.from.id == config.ADMIN || ctx.from.id == config.ADMIN1 || ctx.from.id == config.ADMIN2){
            video2 = ctx.message.video
            mediaId2 = ctx.message.media_group_id
            caption2 = ctx.message.caption
            
            if(mediaId2 == undefined){
                if(video2.file_name == undefined){
                    fileDetails1 = {
                        file_name: today2(ctx),
                        userId:ctx.from.id,
                        file_id: video2.file_id,
                        caption: caption2,
                        file_size: video2.file_size,
                        uniqueId: video2.file_unique_id,
                        type: 'video'
                    }
                }else{
                    var exstension = video2.file_name;
                    var regex = /\.[A-Za-z0-9]+$/gm
                    var vidtext = exstension.replace(regex, '');
                    fileDetails2 = {
                        file_name: vidtext,
                        userId:ctx.from.id,
                        file_id: video2.file_id,
                        caption: caption2,
                        file_size: video2.file_size,
                        uniqueId: video2.file_unique_id,
                        type: 'video'
                    }
                }
            }else{
                if(video2.file_name == undefined){
                    fileDetails3 = {
                        file_name: today2(ctx),
                        userId:ctx.from.id,
                        file_id: video2.file_id,
                        mediaId: mediaId2,
                        caption: caption2,
                        file_size: video2.file_size,
                        uniqueId: video2.file_unique_id,
                        type: 'video'
                    }
                }else{
                    var exstension2 = video2.file_name;
                    var regex2 = /\.[A-Za-z0-9]+$/gm
                    var vidtext2 = exstension2.replace(regex2, '');
                    fileDetails4 = {
                        file_name: vidtext2,
                        userId:ctx.from.id,
                        file_id: video2.file_id,
                        mediaId: mediaId2,
                        caption: caption2,
                        file_size: video2.file_size,
                        uniqueId: video2.file_unique_id,
                        type: 'video'
                    }
                }
            }

            if(mediaId2 == undefined){
                if(video2.file_name == undefined){
                    await saver.checkFile(`${fileDetails1.uniqueId}`).then(async res => {
                        //console.log(res);
                        if(res == true) {
                            await ctx.reply(`File sudah ada.`,{
                                reply_to_message_id: ctx.message.message_id
                            })
                        }else{
                            await saver.saveFile(fileDetails1)
                            await ctx.reply(`✔️ Video disimpan \n<b>Nama file:</b> ${fileDetails1.file_name}\n<b>Size:</b> ${fileDetails1.file_size} B\n<b>ID file:</b> ${fileDetails1.uniqueId}\n\nhttps://t.me/${config.BOTUSERNAME}?start=${fileDetails1.uniqueId}`,{
                                parse_mode: 'HTML',
                                disable_web_page_preview: true,
                                reply_to_message_id: ctx.message.message_id
                            })
                            if(caption2 == undefined)
                                return await ctx.replyWithVideo(fileDetails1.file_id, {
                                    chat_id: config.LOG_CHANNEL,
                                    caption: `✔️ Video disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails1.file_name}\n<b>Size:</b> ${fileDetails1.file_size} B\n<b>ID file:</b> ${fileDetails1.file_id}\n\nhttps://t.me/${config.BOTUSERNAME}?start=${fileDetails1.uniqueId}`,
                                    parse_mode:'HTML'
                                })
                                await ctx.replyWithVideo(fileDetails1.file_id, {
                                    chat_id: config.LOG_CHANNEL,
                                    caption: `${fileDetails1.caption}\n\n✔️ Video disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails1.file_name}\n<b>Size:</b> ${fileDetails1.file_size} B\n<b>ID file:</b> ${fileDetails1.file_id}\n\nhttps://t.me/${config.BOTUSERNAME}?start=${fileDetails1.uniqueId}`,
                                    parse_mode:'HTML'
                                })
                        }
                    })
                }else{
                    await saver.checkFile(`${fileDetails2.uniqueId}`).then(async res => {
                        //console.log(res);
                        if(res == true) {
                            await ctx.reply(`File sudah ada.`,{
                                reply_to_message_id: ctx.message.message_id
                            })
                        }else{
                            await saver.saveFile2(fileDetails2)
                            await ctx.reply(`✔️ Video disimpan \n<b>Nama file:</b> ${fileDetails2.file_name}\n<b>Size:</b> ${fileDetails2.file_size} B\n<b>ID file:</b> ${fileDetails2.uniqueId}\n\nhttps://t.me/${config.BOTUSERNAME}?start=${fileDetails2.uniqueId}`,{
                                parse_mode: 'HTML',
                                disable_web_page_preview: true,
                                reply_to_message_id: ctx.message.message_id
                            })
                            if(caption2 == undefined)
                                return await ctx.replyWithVideo(fileDetails2.file_id, {
                                    chat_id: config.LOG_CHANNEL,
                                    caption: `✔️ Video disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails2.file_name}\n<b>Size:</b> ${fileDetails2.file_size} B\n<b>ID file:</b> ${fileDetails2.file_id}\n\nhttps://t.me/${config.BOTUSERNAME}?start=${fileDetails2.uniqueId}`,
                                    parse_mode:'HTML'
                                })
                                await ctx.replyWithVideo(fileDetails2.file_id, {
                                    chat_id: config.LOG_CHANNEL,
                                    caption: `${fileDetails2.caption}\n\n✔️ Video disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails2.file_name}\n<b>Size:</b> ${fileDetails2.file_size} B\n<b>ID file:</b> ${fileDetails2.file_id}\n\nhttps://t.me/${config.BOTUSERNAME}?start=${fileDetails2.uniqueId}`,
                                    parse_mode:'HTML'
                                })
                        }
                    })
                }
            }else{
                if(video2.file_name == undefined){
                    await saver.checkFile(`${fileDetails3.uniqueId}`).then(async res => {
                        //console.log(res);
                        if(res == true) {
                            await ctx.reply(`File sudah ada.`,{
                                reply_to_message_id: ctx.message.message_id
                            })
                        }else{
                            await saver.saveFile3(fileDetails3)
                            await ctx.reply(`✔️ Grup disimpan \n<b>Nama file:</b> ${fileDetails3.file_name}\n<b>Size:</b> ${fileDetails3.file_size} B\n<b>ID file:</b> ${fileDetails3.uniqueId}\n<b>ID grup:</b> ${fileDetails3.mediaId}\n\nhttps://t.me/${config.BOTUSERNAME}?start=${fileDetails3.uniqueId}\nhttps://t.me/${config.BOTUSERNAME}?start=grp_${fileDetails3.mediaId}`,{
                                parse_mode: 'HTML',
                                disable_web_page_preview: true,
                                reply_to_message_id: ctx.message.message_id
                            })
                            if(caption2 == undefined)                   
                                return await ctx.replyWithVideo(fileDetails3.file_id, {
                                    chat_id: config.LOG_CHANNEL,
                                    caption: `✔️ Grup disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails3.file_name}\n<b>Size:</b> ${fileDetails3.file_size} B\n<b>ID file:</b> ${fileDetails3.file_id}\n<b>ID grup:</b> ${fileDetails3.mediaId}\n\nhttps://t.me/${config.BOTUSERNAME}?start=${fileDetails3.uniqueId}\nhttps://t.me/${config.BOTUSERNAME}?start=grp_${fileDetails3.mediaId}`,
                                    parse_mode:'HTML'
                                })
                                await ctx.replyWithVideo(fileDetails3.file_id, {
                                    chat_id: config.LOG_CHANNEL,
                                    caption: `${fileDetails3.caption}\n\n✔️ Grup disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails3.file_name}\n<b>Size:</b> ${fileDetails3.file_size} B\n<b>ID file:</b> ${fileDetails3.file_id}\n<b>ID grup:</b> ${fileDetails3.mediaId}\n\nhttps://t.me/${config.BOTUSERNAME}?start=grp_${fileDetails3.uniqueId}\nhttps://t.me/${config.BOTUSERNAME}?start=grp_${fileDetails3.mediaId}`,
                                    parse_mode:'HTML'
                                })
                        }
                    })
                }else{
                    await saver.checkFile(`${fileDetails4.uniqueId}`).then(async res => {
                        //console.log(res);
                        if(res == true) {
                            await ctx.reply(`File sudah ada.`,{
                                reply_to_message_id: ctx.message.message_id
                            })
                        }else{
                            await saver.saveFile4(fileDetails4)
                            await ctx.reply(`✔️ Grup disimpan \n<b>Nama file:</b> ${fileDetails4.file_name}\n<b>Size:</b> ${fileDetails4.file_size} B\n<b>ID file:</b> ${fileDetails4.uniqueId}\n<b>ID grup:</b> ${fileDetails4.mediaId}\n\nhttps://t.me/${config.BOTUSERNAME}?start=${fileDetails4.uniqueId}\nhttps://t.me/${config.BOTUSERNAME}?start=grp_${fileDetails4.mediaId}`,{
                                parse_mode: 'HTML',
                                disable_web_page_preview: true,
                                reply_to_message_id: ctx.message.message_id
                            })
                            if(caption2 == undefined)                   
                                return await ctx.replyWithVideo(fileDetails4.file_id, {
                                    chat_id: config.LOG_CHANNEL,
                                    caption: `✔️ Grup disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails4.file_name}\n<b>Size:</b> ${fileDetails4.file_size} B\n<b>ID file:</b> ${fileDetails4.file_id}\n<b>ID grup:</b> ${fileDetails4.mediaId}\n\nhttps://t.me/${config.BOTUSERNAME}?start=${fileDetails4.uniqueId}\nhttps://t.me/${config.BOTUSERNAME}?start=grp_${fileDetails4.mediaId}`,
                                    parse_mode:'HTML'
                                })
                                await ctx.replyWithVideo(fileDetails4.file_id, {
                                    chat_id: config.LOG_CHANNEL,
                                    caption: `${fileDetails4.caption}\n\n✔️ Grup disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails4.file_name}\n<b>Size:</b> ${fileDetails4.file_size} B\n<b>ID file:</b> ${fileDetails4.file_id}\n<b>ID grup:</b> ${fileDetails4.mediaId}\n\nhttps://t.me/${config.BOTUSERNAME}?start=${fileDetails4.uniqueId}\nhttps://t.me/${config.BOTUSERNAME}?start=grp_${fileDetails4.mediaId}`,
                                    parse_mode:'HTML'
                                })
                        }
                    })
                }
            }
        }else{
            var botStatus = await bot.telegram.getChatMember(channelId, ctx.botInfo.id)
            var member = await bot.telegram.getChatMember(channelId, ctx.from.id)
            //console.log(member);
            if(member.status == 'restricted' || member.status == 'left' || member.status == 'kicked'){
                const profile2 = await bot.telegram.getUserProfilePhotos(ctx.from.id)
                await saver.checkBan(`${ctx.from.id}`).then(async res => {
                    //console.log(res);
                    if(res == true) {
                        await ctx.reply(`${messagebanned(ctx)}`)
                    }else{
                        if(!profile2 || profile2.total_count == 0)
                        return await ctx.reply(`<a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n\n${welcomejoin(ctx)}`,{
                            parse_mode:'HTML',
                            disable_web_page_preview: true,
                            reply_markup:{
                                inline_keyboard:inKey2
                            }
                        })
                        await ctx.replyWithPhoto(profile2.photos[0][0].file_id,{caption: `<a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n\n${welcomejoin(ctx)}`,
                            parse_mode:'HTML',
                            disable_web_page_preview: true,
                            reply_markup:{
                                inline_keyboard:inKey2
                            }
                        })
                    }
                })
            }else{
                video3 = ctx.message.document
                mediaId3 = ctx.message.media_group_id
                caption3 = ctx.message.caption
        
                if(mediaId3 == undefined){
                    if(video3.file_name == undefined){
                        fileDetails1 = {
                            file_name: today2(ctx),
                            userId:ctx.from.id,
                            file_id: video3.file_id,
                            caption: caption3,
                            file_size: video3.file_size,
                            uniqueId: video3.file_unique_id,
                            type: 'video'
                        }
                    }else{
                        var exstension = video3.file_name;
                        var regex = /\.[A-Za-z0-9]+$/gm
                        var vidtext = exstension.replace(regex, '');
                        fileDetails2 = {
                            file_name: vidtext,
                            userId:ctx.from.id,
                            file_id: video3.file_id,
                            caption: caption3,
                            file_size: video3.file_size,
                            uniqueId: video3.file_unique_id,
                            type: 'video'
                        }
                    }
                }else{
                    if(video3.file_name == undefined){
                        fileDetails3 = {
                            file_name: today2(ctx),
                            userId:ctx.from.id,
                            file_id: video3.file_id,
                            mediaId: mediaId3,
                            caption: caption3,
                            file_size: video3.file_size,
                            uniqueId: video3.file_unique_id,
                            type: 'video'
                        }
                    }else{
                        var exstension2 = video3.file_name;
                        var regex2 = /\.[A-Za-z0-9]+$/gm
                        var vidtext2 = exstension2.replace(regex2, '');
                        fileDetails4 = {
                            file_name: vidtext2,
                            userId:ctx.from.id,
                            file_id: video3.file_id,
                            mediaId: mediaId3,
                            caption: caption3,
                            file_size: video3.file_size,
                            uniqueId: video3.file_unique_id,
                            type: 'video'
                        }
                    }
                }
            
                if(mediaId3 == undefined){
                    if(video3.file_name == undefined){
                        await saver.checkBan(`${ctx.from.id}`).then(async res => {
                            //console.log(res);
                            if(res == true) {
                                await ctx.reply(`${messagebanned(ctx)}`)
                            }else{
                                await saver.checkFile(`${fileDetails1.uniqueId}`).then(async res => {
                                    //console.log(res);
                                    if(res == true) {
                                        await ctx.reply(`File sudah ada.`,{
                                            reply_to_message_id: ctx.message.message_id
                                        })
                                    }else{
                                        await saver.saveFile(fileDetails1)
                                        await ctx.reply(`✔️ Video disimpan \n<b>Nama file:</b> ${fileDetails1.file_name}\n<b>Size:</b> ${fileDetails1.file_size} B\n<b>ID file:</b> ${fileDetails1.uniqueId}\n\nhttps://t.me/${config.BOTUSERNAME}?start=${fileDetails1.uniqueId}`,{
                                            parse_mode: 'HTML',
                                            disable_web_page_preview: true,
                                            reply_to_message_id: ctx.message.message_id
                                        })
                                        if(caption3 == undefined)
                                            return await ctx.replyWithVideo(fileDetails1.file_id, {
                                                chat_id: config.LOG_CHANNEL,
                                                caption: `✔️ Video disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails1.file_name}\n<b>Size:</b> ${fileDetails1.file_size} B\n<b>ID file:</b> ${fileDetails1.file_id}\n\nhttps://t.me/${config.BOTUSERNAME}?start=${fileDetails1.uniqueId}`,
                                                parse_mode:'HTML'
                                            })
                                            await ctx.replyWithVideo(fileDetails1.file_id, {
                                                chat_id: config.LOG_CHANNEL,
                                                caption: `${fileDetails1.caption}\n\n✔️ Video disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails1.file_name}\n<b>Size:</b> ${fileDetails1.file_size} B\n<b>ID file:</b> ${fileDetails1.file_id}\n\nhttps://t.me/${config.BOTUSERNAME}?start=${fileDetails1.uniqueId}`,
                                                parse_mode:'HTML'
                                            })
                                    }
                                })
                            }
                        })
                    }else{
                        await saver.checkBan(`${ctx.from.id}`).then(async res => {
                            //console.log(res);
                            if(res == true) {
                                await ctx.reply(`${messagebanned(ctx)}`)
                            }else{
                                await saver.checkFile(`${fileDetails2.uniqueId}`).then(async res => {
                                    //console.log(res);
                                    if(res == true) {
                                        await ctx.reply(`File sudah ada.`,{
                                            reply_to_message_id: ctx.message.message_id
                                        })
                                    }else{
                                        await saver.saveFile2(fileDetails2)
                                        await ctx.reply(`✔️ Video disimpan \n<b>Nama file:</b> ${fileDetails2.file_name}\n<b>Size:</b> ${fileDetails2.file_size} B\n<b>ID file:</b> ${fileDetails2.uniqueId}\n\nhttps://t.me/${config.BOTUSERNAME}?start=${fileDetails2.uniqueId}`,{
                                            parse_mode: 'HTML',
                                            disable_web_page_preview: true,
                                            reply_to_message_id: ctx.message.message_id
                                        })
                                        if(caption3 == undefined)
                                            return await ctx.replyWithVideo(fileDetails2.file_id, {
                                                chat_id: config.LOG_CHANNEL,
                                                caption: `✔️ Video disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails2.file_name}\n<b>Size:</b> ${fileDetails2.file_size} B\n<b>ID file:</b> ${fileDetails2.file_id}\n\nhttps://t.me/${config.BOTUSERNAME}?start=${fileDetails2.uniqueId}`,
                                                parse_mode:'HTML'
                                            })
                                            await ctx.replyWithVideo(fileDetails2.file_id, {
                                                chat_id: config.LOG_CHANNEL,
                                                caption: `${fileDetails2.caption}\n\n✔️ Video disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails2.file_name}\n<b>Size:</b> ${fileDetails2.file_size} B\n<b>ID file:</b> ${fileDetails2.file_id}\n\nhttps://t.me/${config.BOTUSERNAME}?start=${fileDetails2.uniqueId}`,
                                                parse_mode:'HTML'
                                            })
                                    }
                                })
                            }
                        })
                    }
                }else{
                    if(video3.file_name == undefined){
                        await saver.checkBan(`${ctx.from.id}`).then(async res => {
                            //console.log(res);
                            if(res == true) {
                                await ctx.reply(`${messagebanned(ctx)}`)
                            }else{
                                await saver.checkFile(`${fileDetails3.uniqueId}`).then(async res => {
                                    //console.log(res);
                                    if(res == true) {
                                        await ctx.reply(`File sudah ada.`,{
                                            reply_to_message_id: ctx.message.message_id
                                        })
                                    }else{
                                        await saver.saveFile3(fileDetails3)
                                        await ctx.reply(`✔️ Grup disimpan \n<b>Nama file:</b> ${fileDetails3.file_name}\n<b>Size:</b> ${fileDetails3.file_size} B\n<b>ID file:</b> ${fileDetails3.uniqueId}\n<b>ID grup:</b> ${fileDetails3.mediaId}\n\nhttps://t.me/${config.BOTUSERNAME}?start=${fileDetails3.uniqueId}\nhttps://t.me/${config.BOTUSERNAME}?start=grp_${fileDetails3.mediaId}`,{
                                            parse_mode: 'HTML',
                                            disable_web_page_preview: true,
                                            reply_to_message_id: ctx.message.message_id
                                        })
                                        if(caption3 == undefined)                   
                                            return await ctx.replyWithVideo(fileDetails3.file_id, {
                                                chat_id: config.LOG_CHANNEL,
                                                caption: `✔️ Grup disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails3.file_name}\n<b>Size:</b> ${fileDetails3.file_size} B\n<b>ID file:</b> ${fileDetails3.file_id}\n<b>ID grup:</b> ${fileDetails3.mediaId}\n\nhttps://t.me/${config.BOTUSERNAME}?start=${fileDetails3.uniqueId}\nhttps://t.me/${config.BOTUSERNAME}?start=grp_${fileDetails3.mediaId}`,
                                                parse_mode:'HTML'
                                            })
                                            await ctx.replyWithVideo(fileDetails3.file_id, {
                                                chat_id: config.LOG_CHANNEL,
                                                caption: `${fileDetails3.caption}\n\n✔️ Grup disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails3.file_name}\n<b>Size:</b> ${fileDetails3.file_size} B\n<b>ID file:</b> ${fileDetails3.file_id}\n<b>ID grup:</b> ${fileDetails3.mediaId}\n\nhttps://t.me/${config.BOTUSERNAME}?start=grp_${fileDetails3.uniqueId}\nhttps://t.me/${config.BOTUSERNAME}?start=grp_${fileDetails3.mediaId}`,
                                                parse_mode:'HTML'
                                            })
                                    }
                                })
                            }
                        })
                    }else{
                        await saver.checkBan(`${ctx.from.id}`).then(async res => {
                            //console.log(res);
                            if(res == true) {
                                await ctx.reply(`${messagebanned(ctx)}`)
                            }else{
                                await saver.checkFile(`${fileDetails4.uniqueId}`).then(async res => {
                                    //console.log(res);
                                    if(res == true) {
                                        await ctx.reply(`File sudah ada.`,{
                                            reply_to_message_id: ctx.message.message_id
                                        })
                                    }else{
                                        await saver.saveFile4(fileDetails4)
                                        await ctx.reply(`✔️ Grup disimpan \n<b>Nama file:</b> ${fileDetails4.file_name}\n<b>Size:</b> ${fileDetails4.file_size} B\n<b>ID file:</b> ${fileDetails4.uniqueId}\n<b>ID grup:</b> ${fileDetails4.mediaId}\n\nhttps://t.me/${config.BOTUSERNAME}?start=${fileDetails4.uniqueId}\nhttps://t.me/${config.BOTUSERNAME}?start=grp_${fileDetails4.mediaId}`,{
                                            parse_mode: 'HTML',
                                            disable_web_page_preview: true,
                                            reply_to_message_id: ctx.message.message_id
                                        })
                                        if(caption3 == undefined)                   
                                            return await ctx.replyWithVideo(fileDetails4.file_id, {
                                                chat_id: config.LOG_CHANNEL,
                                                caption: `✔️ Grup disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails4.file_name}\n<b>Size:</b> ${fileDetails4.file_size} B\n<b>ID file:</b> ${fileDetails4.file_id}\n<b>ID grup:</b> ${fileDetails4.mediaId}\n\nhttps://t.me/${config.BOTUSERNAME}?start=${fileDetails4.uniqueId}\nhttps://t.me/${config.BOTUSERNAME}?start=grp_${fileDetails4.mediaId}`,
                                                parse_mode:'HTML'
                                            })
                                            await ctx.replyWithVideo(fileDetails4.file_id, {
                                                chat_id: config.LOG_CHANNEL,
                                                caption: `${fileDetails4.caption}\n\n✔️ Grup disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails4.file_name}\n<b>Size:</b> ${fileDetails4.file_size} B\n<b>ID file:</b> ${fileDetails4.file_id}\n<b>ID grup:</b> ${fileDetails4.mediaId}\n\nhttps://t.me/${config.BOTUSERNAME}?start=${fileDetails4.uniqueId}\nhttps://t.me/${config.BOTUSERNAME}?start=grp_${fileDetails4.mediaId}`,
                                                parse_mode:'HTML'
                                            })
                                    }
                                })
                            }
                        })
                    }
                }
            }
        }
    }
    return next();
})

//photo files
bot.on('photo', async(ctx, next) => {
    await new Promise((resolve, reject) =>{
        setTimeout(()=>{
            return resolve("Result");
        }, 2_000);
    });

    if(ctx.chat.type == 'private') {
        if(ctx.from.id == config.ADMIN || ctx.from.id == config.ADMIN1 || ctx.from.id == config.ADMIN2){
            photo2 = ctx.message.photo[1]
            mediaId2 = ctx.message.media_group_id
            caption2 = ctx.message.caption
            
            if(mediaId2 == undefined){
                if(photo2.file_name == undefined){
                    fileDetails1 = {
                        file_name: today2(ctx),
                        userId:ctx.from.id,
                        file_id: photo2.file_id,
                        caption: caption2,
                        file_size: photo2.file_size,
                        uniqueId: photo2.file_unique_id,
                        type: 'photo'
                    }
                }else{
                    var exstension = photo2.file_name;
                    var regex = /\.[A-Za-z0-9]+$/gm
                    var photext = exstension.replace(regex, '');
                    fileDetails2 = {
                        file_name: photext,
                        userId:ctx.from.id,
                        file_id: photo2.file_id,
                        caption: caption2,
                        file_size: photo2.file_size,
                        uniqueId: photo2.file_unique_id,
                        type: 'photo'
                    }
                }
            }else{
                if(photo2.file_name == undefined){
                    fileDetails3 = {
                        file_name: today2(ctx),
                        userId:ctx.from.id,
                        file_id: photo2.file_id,
                        mediaId: mediaId2,
                        caption: caption2,
                        file_size: photo2.file_size,
                        uniqueId: photo2.file_unique_id,
                        type: 'photo'
                    }
                }else{
                    var exstension2 = photo2.file_name;
                    var regex2 = /\.[A-Za-z0-9]+$/gm
                    var photext2 = exstension2.replace(regex2, '');
                    fileDetails4 = {
                        file_name: photext2,
                        userId:ctx.from.id,
                        file_id: photo2.file_id,
                        mediaId: mediaId2,
                        caption: caption2,
                        file_size: photo2.file_size,
                        uniqueId: photo2.file_unique_id,
                        type: 'photo'
                    }
                }
            }

            if(mediaId2 == undefined){
                if(photo2.file_name == undefined){
                    await saver.checkFile(`${fileDetails1.uniqueId}`).then(async res => {
                        //console.log(res);
                        if(res == true) {
                            await ctx.reply(`File sudah ada.`,{
                                reply_to_message_id: ctx.message.message_id
                            })
                        }else{
                            await saver.saveFile(fileDetails1)
                            await ctx.reply(`✔️ Photo disimpan \n<b>Nama file:</b> ${fileDetails1.file_name}\n<b>Size:</b> ${fileDetails1.file_size} B\n<b>ID file:</b> ${fileDetails1.uniqueId}\n\nhttps://t.me/${config.BOTUSERNAME}?start=${fileDetails1.uniqueId}`,{
                                parse_mode: 'HTML',
                                disable_web_page_preview: true,
                                reply_to_message_id: ctx.message.message_id
                            })
                            if(caption2 == undefined)
                                return await ctx.replyWithPhoto(fileDetails1.file_id, {
                                    chat_id: config.LOG_CHANNEL,
                                    caption: `✔️ Photo disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails1.file_name}\n<b>Size:</b> ${fileDetails1.file_size} B\n<b>ID file:</b> ${fileDetails1.file_id}\n\nhttps://t.me/${config.BOTUSERNAME}?start=${fileDetails1.uniqueId}`,
                                    parse_mode:'HTML'
                                })
                                await ctx.replyWithPhoto(fileDetails1.file_id, {
                                    chat_id: config.LOG_CHANNEL,
                                    caption: `${fileDetails1.caption}\n\n✔️ Photo disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails1.file_name}\n<b>Size:</b> ${fileDetails1.file_size} B\n<b>ID file:</b> ${fileDetails1.file_id}\n\nhttps://t.me/${config.BOTUSERNAME}?start=${fileDetails1.uniqueId}`,
                                    parse_mode:'HTML'
                                })
                        }
                    })
                }else{
                    await saver.checkFile(`${fileDetails2.uniqueId}`).then(async res => {
                        //console.log(res);
                        if(res == true) {
                            await ctx.reply(`File sudah ada.`,{
                                reply_to_message_id: ctx.message.message_id
                            })
                        }else{
                            await saver.saveFile2(fileDetails2)
                            await ctx.reply(`✔️ Photo disimpan \n<b>Nama file:</b> ${fileDetails2.file_name}\n<b>Size:</b> ${fileDetails2.file_size} B\n<b>ID file:</b> ${fileDetails2.uniqueId}\n\nhttps://t.me/${config.BOTUSERNAME}?start=${fileDetails2.uniqueId}`,{
                                parse_mode: 'HTML',
                                disable_web_page_preview: true,
                                reply_to_message_id: ctx.message.message_id
                            })
                            if(caption2 == undefined)
                                return await ctx.replyWithPhoto(fileDetails2.file_id, {
                                    chat_id: config.LOG_CHANNEL,
                                    caption: `✔️ Photo disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails2.file_name}\n<b>Size:</b> ${fileDetails2.file_size} B\n<b>ID file:</b> ${fileDetails2.file_id}\n\nhttps://t.me/${config.BOTUSERNAME}?start=${fileDetails2.uniqueId}`,
                                    parse_mode:'HTML'
                                })
                                await ctx.replyWithPhoto(fileDetails2.file_id, {
                                    chat_id: config.LOG_CHANNEL,
                                    caption: `${fileDetails2.caption}\n\n✔️ Photo disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails2.file_name}\n<b>Size:</b> ${fileDetails2.file_size} B\n<b>ID file:</b> ${fileDetails2.file_id}\n\nhttps://t.me/${config.BOTUSERNAME}?start=${fileDetails2.uniqueId}`,
                                    parse_mode:'HTML'
                                })
                        }
                    })
                }
            }else{
                if(photo2.file_name == undefined){
                    await saver.checkFile(`${fileDetails3.uniqueId}`).then(async res => {
                        //console.log(res);
                        if(res == true) {
                            await ctx.reply(`File sudah ada.`,{
                                reply_to_message_id: ctx.message.message_id
                            })
                        }else{
                            await saver.saveFile3(fileDetails3)
                            await ctx.reply(`✔️ Grup disimpan \n<b>Nama file:</b> ${fileDetails3.file_name}\n<b>Size:</b> ${fileDetails3.file_size} B\n<b>ID file:</b> ${fileDetails3.uniqueId}\n<b>ID grup:</b> ${fileDetails3.mediaId}\n\nhttps://t.me/${config.BOTUSERNAME}?start=${fileDetails3.uniqueId}\nhttps://t.me/${config.BOTUSERNAME}?start=grp_${fileDetails3.mediaId}`,{
                                parse_mode: 'HTML',
                                disable_web_page_preview: true,
                                reply_to_message_id: ctx.message.message_id
                            })
                            if(caption2 == undefined)                   
                                return await ctx.replyWithPhoto(fileDetails3.file_id, {
                                    chat_id: config.LOG_CHANNEL,
                                    caption: `✔️ Grup disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails3.file_name}\n<b>Size:</b> ${fileDetails3.file_size} B\n<b>ID file:</b> ${fileDetails3.file_id}\n<b>ID grup:</b> ${fileDetails3.mediaId}\n\nhttps://t.me/${config.BOTUSERNAME}?start=${fileDetails3.uniqueId}\nhttps://t.me/${config.BOTUSERNAME}?start=grp_${fileDetails3.mediaId}`,
                                    parse_mode:'HTML'
                                })
                                await ctx.replyWithPhoto(fileDetails3.file_id, {
                                    chat_id: config.LOG_CHANNEL,
                                    caption: `${fileDetails3.caption}\n\n✔️ Grup disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails3.file_name}\n<b>Size:</b> ${fileDetails3.file_size} B\n<b>ID file:</b> ${fileDetails3.file_id}\n<b>ID grup:</b> ${fileDetails3.mediaId}\n\nhttps://t.me/${config.BOTUSERNAME}?start=grp_${fileDetails3.uniqueId}\nhttps://t.me/${config.BOTUSERNAME}?start=grp_${fileDetails3.mediaId}`,
                                    parse_mode:'HTML'
                                })
                        }
                    })
                }else{
                    await saver.checkFile(`${fileDetails4.uniqueId}`).then(async res => {
                        //console.log(res);
                        if(res == true) {
                            await ctx.reply(`File sudah ada.`,{
                                reply_to_message_id: ctx.message.message_id
                            })
                        }else{
                            await saver.saveFile4(fileDetails4)
                            await ctx.reply(`✔️ Grup disimpan \n<b>Nama file:</b> ${fileDetails4.file_name}\n<b>Size:</b> ${fileDetails4.file_size} B\n<b>ID file:</b> ${fileDetails4.uniqueId}\n<b>ID grup:</b> ${fileDetails4.mediaId}\n\nhttps://t.me/${config.BOTUSERNAME}?start=${fileDetails4.uniqueId}\nhttps://t.me/${config.BOTUSERNAME}?start=grp_${fileDetails4.mediaId}`,{
                                parse_mode: 'HTML',
                                disable_web_page_preview: true,
                                reply_to_message_id: ctx.message.message_id
                            })
                            if(caption2 == undefined)                   
                                return await ctx.replyWithPhoto(fileDetails4.file_id, {
                                    chat_id: config.LOG_CHANNEL,
                                    caption: `✔️ Grup disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails4.file_name}\n<b>Size:</b> ${fileDetails4.file_size} B\n<b>ID file:</b> ${fileDetails4.file_id}\n<b>ID grup:</b> ${fileDetails4.mediaId}\n\nhttps://t.me/${config.BOTUSERNAME}?start=${fileDetails4.uniqueId}\nhttps://t.me/${config.BOTUSERNAME}?start=grp_${fileDetails4.mediaId}`,
                                    parse_mode:'HTML'
                                })
                                await ctx.replyWithPhoto(fileDetails4.file_id, {
                                    chat_id: config.LOG_CHANNEL,
                                    caption: `${fileDetails4.caption}\n\n✔️ Grup disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails4.file_name}\n<b>Size:</b> ${fileDetails4.file_size} B\n<b>ID file:</b> ${fileDetails4.file_id}\n<b>ID grup:</b> ${fileDetails4.mediaId}\n\nhttps://t.me/${config.BOTUSERNAME}?start=${fileDetails4.uniqueId}\nhttps://t.me/${config.BOTUSERNAME}?start=grp_${fileDetails4.mediaId}`,
                                    parse_mode:'HTML'
                                })
                        }
                    })
                }
            }
        }else{
            var botStatus = await bot.telegram.getChatMember(channelId, ctx.botInfo.id)
            var member = await bot.telegram.getChatMember(channelId, ctx.from.id)
            //console.log(member);
            if(member.status == 'restricted' || member.status == 'left' || member.status == 'kicked'){
                const profile2 = await bot.telegram.getUserProfilePhotos(ctx.from.id)
                await saver.checkBan(`${ctx.from.id}`).then(async res => {
                    //console.log(res);
                    if(res == true) {
                        await ctx.reply(`${messagebanned(ctx)}`)
                    }else{
                        if(!profile2 || profile2.total_count == 0)
                        return await ctx.reply(`<a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n\n${welcomejoin(ctx)}`,{
                            parse_mode:'HTML',
                            disable_web_page_preview: true,
                            reply_markup:{
                                inline_keyboard:inKey2
                            }
                        })
                        await ctx.replyWithPhoto(profile2.photos[0][0].file_id,{caption: `<a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n\n${welcomejoin(ctx)}`,
                            parse_mode:'HTML',
                            disable_web_page_preview: true,
                            reply_markup:{
                                inline_keyboard:inKey2
                            }
                        })
                    }
                })
            }else{
                photo3 = ctx.message.photo[1]
                mediaId3 = ctx.message.media_group_id
                caption3 = ctx.message.caption
        
                if(mediaId3 == undefined){
                    if(photo3.file_name == undefined){
                        fileDetails1 = {
                            file_name: today2(ctx),
                            userId:ctx.from.id,
                            file_id: photo3.file_id,
                            caption: caption3,
                            file_size: photo3.file_size,
                            uniqueId: photo3.file_unique_id,
                            type: 'photo'
                        }
                    }else{
                        var exstension = photo3.file_name;
                        var regex = /\.[A-Za-z0-9]+$/gm
                        var photext = exstension.replace(regex, '');
                        fileDetails2 = {
                            file_name: photext,
                            userId:ctx.from.id,
                            file_id: photo3.file_id,
                            caption: caption3,
                            file_size: photo3.file_size,
                            uniqueId: photo3.file_unique_id,
                            type: 'photo'
                        }
                    }
                }else{
                    if(photo3.file_name == undefined){
                        fileDetails3 = {
                            file_name: today2(ctx),
                            userId:ctx.from.id,
                            file_id: photo3.file_id,
                            mediaId: mediaId3,
                            caption: caption3,
                            file_size: photo3.file_size,
                            uniqueId: photo3.file_unique_id,
                            type: 'photo'
                        }
                    }else{
                        var exstension2 = photo3.file_name;
                        var regex2 = /\.[A-Za-z0-9]+$/gm
                        var photext2 = exstension2.replace(regex2, '');
                        fileDetails4 = {
                            file_name: photext2,
                            userId:ctx.from.id,
                            file_id: photo3.file_id,
                            mediaId: mediaId3,
                            caption: caption3,
                            file_size: photo3.file_size,
                            uniqueId: photo3.file_unique_id,
                            type: 'photo'
                        }
                    }
                }
            
                if(mediaId3 == undefined){
                    if(photo3.file_name == undefined){
                        await saver.checkBan(`${ctx.from.id}`).then(async res => {
                            //console.log(res);
                            if(res == true) {
                                await ctx.reply(`${messagebanned(ctx)}`)
                            }else{
                                await saver.checkFile(`${fileDetails1.uniqueId}`).then(async res => {
                                    //console.log(res);
                                    if(res == true) {
                                        await ctx.reply(`File sudah ada.`,{
                                            reply_to_message_id: ctx.message.message_id
                                        })
                                    }else{
                                        await saver.saveFile(fileDetails1)
                                        await ctx.reply(`✔️ Photo disimpan \n<b>Nama file:</b> ${fileDetails1.file_name}\n<b>Size:</b> ${fileDetails1.file_size} B\n<b>ID file:</b> ${fileDetails1.uniqueId}\n\nhttps://t.me/${config.BOTUSERNAME}?start=${fileDetails1.uniqueId}`,{
                                            parse_mode: 'HTML',
                                            disable_web_page_preview: true,
                                            reply_to_message_id: ctx.message.message_id
                                        })
                                        if(caption3 == undefined)
                                            return await ctx.replyWithPhoto(fileDetails1.file_id, {
                                                chat_id: config.LOG_CHANNEL,
                                                caption: `✔️ Photo disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails1.file_name}\n<b>Size:</b> ${fileDetails1.file_size} B\n<b>ID file:</b> ${fileDetails1.file_id}\n\nhttps://t.me/${config.BOTUSERNAME}?start=${fileDetails1.uniqueId}`,
                                                parse_mode:'HTML'
                                            })
                                            await ctx.replyWithPhoto(fileDetails1.file_id, {
                                                chat_id: config.LOG_CHANNEL,
                                                caption: `${fileDetails1.caption}\n\n✔️ Photo disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails1.file_name}\n<b>Size:</b> ${fileDetails1.file_size} B\n<b>ID file:</b> ${fileDetails1.file_id}\n\nhttps://t.me/${config.BOTUSERNAME}?start=${fileDetails1.uniqueId}`,
                                                parse_mode:'HTML'
                                            })
                                    }
                                })
                            }
                        })
                    }else{
                        await saver.checkBan(`${ctx.from.id}`).then(async res => {
                            //console.log(res);
                            if(res == true) {
                                await ctx.reply(`${messagebanned(ctx)}`)
                            }else{
                                await saver.checkFile(`${fileDetails2.uniqueId}`).then(async res => {
                                    //console.log(res);
                                    if(res == true) {
                                        await ctx.reply(`File sudah ada.`,{
                                            reply_to_message_id: ctx.message.message_id
                                        })
                                    }else{
                                        await saver.saveFile2(fileDetails2)
                                        await ctx.reply(`✔️ Photo disimpan \n<b>Nama file:</b> ${fileDetails2.file_name}\n<b>Size:</b> ${fileDetails2.file_size} B\n<b>ID file:</b> ${fileDetails2.uniqueId}\n\nhttps://t.me/${config.BOTUSERNAME}?start=${fileDetails2.uniqueId}`,{
                                            parse_mode: 'HTML',
                                            disable_web_page_preview: true,
                                            reply_to_message_id: ctx.message.message_id
                                        })
                                        if(caption3 == undefined)
                                            return await ctx.replyWithPhoto(fileDetails2.file_id, {
                                                chat_id: config.LOG_CHANNEL,
                                                caption: `✔️ Photo disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails2.file_name}\n<b>Size:</b> ${fileDetails2.file_size} B\n<b>ID file:</b> ${fileDetails2.file_id}\n\nhttps://t.me/${config.BOTUSERNAME}?start=${fileDetails2.uniqueId}`,
                                                parse_mode:'HTML'
                                            })
                                            await ctx.replyWithPhoto(fileDetails2.file_id, {
                                                chat_id: config.LOG_CHANNEL,
                                                caption: `${fileDetails2.caption}\n\n✔️ Photo disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails2.file_name}\n<b>Size:</b> ${fileDetails2.file_size} B\n<b>ID file:</b> ${fileDetails2.file_id}\n\nhttps://t.me/${config.BOTUSERNAME}?start=${fileDetails2.uniqueId}`,
                                                parse_mode:'HTML'
                                            })
                                    }
                                })
                            }
                        })
                    }
                }else{
                    if(photo3.file_name == undefined){
                        await saver.checkBan(`${ctx.from.id}`).then(async res => {
                            //console.log(res);
                            if(res == true) {
                                await ctx.reply(`${messagebanned(ctx)}`)
                            }else{
                                await saver.checkFile(`${fileDetails3.uniqueId}`).then(async res => {
                                    //console.log(res);
                                    if(res == true) {
                                        await ctx.reply(`File sudah ada.`,{
                                            reply_to_message_id: ctx.message.message_id
                                        })
                                    }else{
                                        await saver.saveFile3(fileDetails3)
                                        await ctx.reply(`✔️ Grup disimpan \n<b>Nama file:</b> ${fileDetails3.file_name}\n<b>Size:</b> ${fileDetails3.file_size} B\n<b>ID file:</b> ${fileDetails3.uniqueId}\n<b>ID grup:</b> ${fileDetails3.mediaId}\n\nhttps://t.me/${config.BOTUSERNAME}?start=${fileDetails3.uniqueId}\nhttps://t.me/${config.BOTUSERNAME}?start=grp_${fileDetails3.mediaId}`,{
                                            parse_mode: 'HTML',
                                            disable_web_page_preview: true,
                                            reply_to_message_id: ctx.message.message_id
                                        })
                                        if(caption3 == undefined)                   
                                            return await ctx.replyWithPhoto(fileDetails3.file_id, {
                                                chat_id: config.LOG_CHANNEL,
                                                caption: `✔️ Grup disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails3.file_name}\n<b>Size:</b> ${fileDetails3.file_size} B\n<b>ID file:</b> ${fileDetails3.file_id}\n<b>ID grup:</b> ${fileDetails3.mediaId}\n\nhttps://t.me/${config.BOTUSERNAME}?start=${fileDetails3.uniqueId}\nhttps://t.me/${config.BOTUSERNAME}?start=grp_${fileDetails3.mediaId}`,
                                                parse_mode:'HTML'
                                            })
                                            await ctx.replyWithPhoto(fileDetails3.file_id, {
                                                chat_id: config.LOG_CHANNEL,
                                                caption: `${fileDetails3.caption}\n\n✔️ Grup disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails3.file_name}\n<b>Size:</b> ${fileDetails3.file_size} B\n<b>ID file:</b> ${fileDetails3.file_id}\n<b>ID grup:</b> ${fileDetails3.mediaId}\n\nhttps://t.me/${config.BOTUSERNAME}?start=grp_${fileDetails3.uniqueId}\nhttps://t.me/${config.BOTUSERNAME}?start=grp_${fileDetails3.mediaId}`,
                                                parse_mode:'HTML'
                                            })
                                    }
                                })
                            }
                        })
                    }else{
                        await saver.checkBan(`${ctx.from.id}`).then(async res => {
                            //console.log(res);
                            if(res == true) {
                                await ctx.reply(`${messagebanned(ctx)}`)
                            }else{
                                await saver.checkFile(`${fileDetails4.uniqueId}`).then(async res => {
                                    //console.log(res);
                                    if(res == true) {
                                        await ctx.reply(`File sudah ada.`,{
                                            reply_to_message_id: ctx.message.message_id
                                        })
                                    }else{
                                        await saver.saveFile4(fileDetails4)
                                        await ctx.reply(`✔️ Grup disimpan \n<b>Nama file:</b> ${fileDetails4.file_name}\n<b>Size:</b> ${fileDetails4.file_size} B\n<b>ID file:</b> ${fileDetails4.uniqueId}\n<b>ID grup:</b> ${fileDetails4.mediaId}\n\nhttps://t.me/${config.BOTUSERNAME}?start=${fileDetails4.uniqueId}\nhttps://t.me/${config.BOTUSERNAME}?start=grp_${fileDetails4.mediaId}`,{
                                            parse_mode: 'HTML',
                                            disable_web_page_preview: true,
                                            reply_to_message_id: ctx.message.message_id
                                        })
                                        if(caption3 == undefined)                   
                                            return await ctx.replyWithPhoto(fileDetails4.file_id, {
                                                chat_id: config.LOG_CHANNEL,
                                                caption: `✔️ Grup disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails4.file_name}\n<b>Size:</b> ${fileDetails4.file_size} B\n<b>ID file:</b> ${fileDetails4.file_id}\n<b>ID grup:</b> ${fileDetails4.mediaId}\n\nhttps://t.me/${config.BOTUSERNAME}?start=${fileDetails4.uniqueId}\nhttps://t.me/${config.BOTUSERNAME}?start=grp_${fileDetails4.mediaId}`,
                                                parse_mode:'HTML'
                                            })
                                            await ctx.replyWithPhoto(fileDetails4.file_id, {
                                                chat_id: config.LOG_CHANNEL,
                                                caption: `${fileDetails4.caption}\n\n✔️ Grup disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails4.file_name}\n<b>Size:</b> ${fileDetails4.file_size} B\n<b>ID file:</b> ${fileDetails4.file_id}\n<b>ID grup:</b> ${fileDetails4.mediaId}\n\nhttps://t.me/${config.BOTUSERNAME}?start=${fileDetails4.uniqueId}\nhttps://t.me/${config.BOTUSERNAME}?start=grp_${fileDetails4.mediaId}`,
                                                parse_mode:'HTML'
                                            })
                                    }
                                })
                            }
                        })
                    }
                }
            }
        }
    }
    return next();
})

bot.command('stats',async(ctx, next)=>{
    await new Promise((resolve, reject) =>{
        setTimeout(()=>{
            return resolve("Result");
        }, 1_000);
    });
    
    await ctx.deleteMessage()
    stats = await saver.getUser().then(async res=>{
        if(ctx.from.id == config.ADMIN || ctx.from.id == config.ADMIN1 || ctx.from.id == config.ADMIN2){
            await ctx.reply(`📊 Total users: <b>${res.length}</b>`,{parse_mode:'HTML'})
        }
    })
    stats = await saver.getMedia().then(async res=>{
        if(ctx.from.id == config.ADMIN || ctx.from.id == config.ADMIN1 || ctx.from.id == config.ADMIN2){
            await ctx.reply(`📊 Total media: <b>${res.length}</b>`,{parse_mode:'HTML'})
        }
    })
    stats = await saver.getBan().then(async res=>{
        if(ctx.from.id == config.ADMIN || ctx.from.id == config.ADMIN1 || ctx.from.id == config.ADMIN2){
            await ctx.reply(`📊 Total users violate: <b>${res.length}</b>`,{parse_mode:'HTML'})
        }
    })
    stats = await saver.getGroup().then(async res=>{
        if(ctx.from.id == config.ADMIN || ctx.from.id == config.ADMIN1 || ctx.from.id == config.ADMIN2){
            await ctx.reply(`📊 Total registered groups: <b>${res.length}</b>`,{parse_mode:'HTML'})
        }
    })
    return next();
})

//nginx config
bot.launch({
    webhook:{
       domain:`${config.domain}`,
       port:`${config.PORT}`
    }
})
