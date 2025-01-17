from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

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

# Store user wallets (in memory for demo)
user_wallets = {}

# Available wallet addresses
wallet_addresses = [
    "GRf2Ch3gLRxcPw4nCSFFLoWLxizEa4xW99HVuL2C8x3J",
    "5BLqkTRtQR54x1u36i8XnD1vE5PP2BhBnKpzKV9NcjMJ",
    "84LHkkzAzf2buuM3w8wiNHwdNCiwJu1JafV7J714eo8Z"
]

# API endpoint to get user's wallet
@api.get("/get_wallet")
async def get_wallet(user_id: str):
    try:
        # Convert user_id to string if it's not already
        user_id = str(user_id)
        
        # Check if user has a wallet
        if user_id in user_wallets:
            return {"wallet": user_wallets[user_id]}
        
        # If no wallet assigned and we have available wallets, assign one
        if wallet_addresses:
            wallet = wallet_addresses.pop(0)
            user_wallets[user_id] = wallet
            return {"wallet": wallet}
        
        # No wallets available
        return {"wallet": None, "message": "No wallets available"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Add this to your main() function
def main():
    # Your existing bot code...
    
    # Run FastAPI app with uvicorn
    import uvicorn
    uvicorn.run(api, host="0.0.0.0", port=8000)
    
    # Start the bot
    application.run_polling() 