from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

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

# API endpoint to get user's wallet
@api.get("/get_wallet")
async def get_wallet(user_id: int):
    try:
        # Use your existing function to get wallet from database
        wallet = await get_user_wallet_from_db(user_id)
        if wallet:
            return {"wallet": wallet}
        return {"wallet": None}
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