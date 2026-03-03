import argparse
import pandas as pd
import csv

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--input", required=True)
    ap.add_argument("--output", required=True)
    ap.add_argument("--sheet", default=0)
    args = ap.parse_args()

    df = pd.read_excel(args.input, sheet_name=args.sheet, dtype=str)
    df.to_csv(
        args.output,
        index=False,
        sep=";",
        encoding="utf-8",
        quoting=csv.QUOTE_MINIMAL,
        na_rep=""
    )

if __name__ == "__main__":
    main()
        