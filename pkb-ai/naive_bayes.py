import pandas as pd
from sklearn.naive_bayes import MultinomialNB
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report

# ── 1. Load data ──────────────────────────────────────────────────────────────
df = pd.read_csv("training_data.csv")
X, y = df["text"], df["intent"]

# ── 2. Split: 80% train, 20% test ────────────────────────────────────────────
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# ── 3. Vectorisasi (Bag of Words) ─────────────────────────────────────────────
vectorizer = CountVectorizer()
X_train_vec = vectorizer.fit_transform(X_train)
X_test_vec  = vectorizer.transform(X_test)

# ── 4. Training Naive Bayes ───────────────────────────────────────────────────
model = MultinomialNB()
model.fit(X_train_vec, y_train)

# ── 5. Evaluasi ───────────────────────────────────────────────────────────────
y_pred = model.predict(X_test_vec)
print("=" * 50)
print(f"Akurasi: {accuracy_score(y_test, y_pred) * 100:.1f}%")
print("=" * 50)
print(classification_report(y_test, y_pred))

# ── 6. Demo klasifikasi (input → proses → output → alasan) ───────────────────
print("=" * 50)
print("DEMO KLASIFIKASI")
print("=" * 50)

test_questions = [
    "jam masuk sekolah berapa?",
    "cara daftar ppdb online",
    "ada wifi di sekolah?",
    "nomor telepon sekolah berapa?",
    "selamat pagi, apa kabar?",
    "kapan libur semester genap?",
    "dokumen apa saja untuk pendaftaran?",
]

for q in test_questions:
    vec = vectorizer.transform([q])
    intent = model.predict(vec)[0]
    proba  = model.predict_proba(vec)[0]
    classes = model.classes_
    confidence = max(proba) * 100

    print(f"\nInput     : {q}")
    print(f"Intent    : {intent} ({confidence:.1f}% yakin)")
    print("Probabilitas per intent:")
    for cls, prob in sorted(zip(classes, proba), key=lambda x: -x[1]):
        bar = "#" * int(prob * 20)
        print(f"  {cls:<12} {prob*100:5.1f}%  {bar}")
