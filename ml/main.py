from fastapi import FastAPI
from forecasting.forecast_model import forecast_next_28_days
from segmentation.rfm_model import calculate_rfm
from segmentation.discount_engine import generate_discounts
from blockchain.blockchain_utils import compute_merkle_root, compute_dataset_hash
import pandas as pd

app = FastAPI()

@app.get("/")
def home():
    return {"message": "Backend running successfully!"}

@app.get("/forecast")
def get_forecast():
    forecast = forecast_next_28_days()
    return {"forecast": forecast}

@app.get("/rfm")
def get_rfm():
    rfm = calculate_rfm()
    return rfm

@app.get("/discounts")
def get_discounts():
    rfm = calculate_rfm()
    discounts = generate_discounts(rfm["segment_summary"])
    return discounts

@app.get("/run-all")
def run_all():
    forecast = forecast_next_28_days()
    rfm = calculate_rfm()
    discounts = generate_discounts(rfm["segment_summary"])
    return {
        "forecast": forecast,
        "rfm": rfm,
        "discounts": discounts,
    }

@app.get("/blockchain/integrity")
def blockchain_integrity():
    df = pd.read_csv("data/online_retail_II.csv")  # ensure file exists on Render
    records = df.to_dict(orient="records")

    dataset_hash = compute_dataset_hash(records)
    merkle_root = compute_merkle_root(records)

    return {
        "dataset_hash": dataset_hash,
        "merkle_root": merkle_root,
        "total_records": len(records)
    }
