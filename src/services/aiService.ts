/**
 * AI Service — Simulated ML prediction & training workflows.
 * Returns staged results with async delays to simulate real processing.
 */

export interface PredictionStep {
    label: string;
    duration: number; // ms
}

export interface PredictionResult {
    documentType: string;
    fields: { label: string; value: string }[];
    confidence: number;
}

const PREDICTION_STEPS: PredictionStep[] = [
    { label: 'Uploading image...', duration: 400 },
    { label: 'Preprocessing image...', duration: 500 },
    { label: 'Extracting features...', duration: 600 },
    { label: 'Running neural network...', duration: 800 },
    { label: 'Generating prediction...', duration: 500 },
];

const SAMPLE_RESULTS: PredictionResult[] = [
    {
        documentType: 'Invoice',
        fields: [
            { label: 'Invoice No', value: 'INV-1024' },
            { label: 'Vendor', value: 'Acme Corp' },
            { label: 'Date', value: '2024-11-15' },
            { label: 'Total Amount', value: '₹12,480' },
            { label: 'Tax', value: '₹2,246' },
            { label: 'Status', value: 'Processed' },
        ],
        confidence: 93.4,
    },
    {
        documentType: 'Receipt',
        fields: [
            { label: 'Receipt No', value: 'REC-0891' },
            { label: 'Store', value: 'Office Supplies Ltd' },
            { label: 'Date', value: '2024-11-20' },
            { label: 'Total', value: '₹3,750' },
            { label: 'Payment', value: 'UPI' },
        ],
        confidence: 88.7,
    },
    {
        documentType: 'Purchase Order',
        fields: [
            { label: 'PO Number', value: 'PO-4421' },
            { label: 'Vendor', value: 'Global Materials Inc' },
            { label: 'Date', value: '2024-11-22' },
            { label: 'Total', value: '₹1,85,000' },
            { label: 'Items', value: '12 line items' },
            { label: 'Delivery', value: '2024-12-10' },
        ],
        confidence: 95.6,
    },
];

export function getPredictionSteps(): PredictionStep[] {
    return [...PREDICTION_STEPS];
}

export function getRandomPrediction(): PredictionResult {
    return SAMPLE_RESULTS[Math.floor(Math.random() * SAMPLE_RESULTS.length)];
}

/**
 * Simulate prediction with step-by-step progress callbacks.
 */
export async function simulatePrediction(
    onStep: (step: string, progress: number) => void
): Promise<PredictionResult> {
    const steps = getPredictionSteps();
    const totalDuration = steps.reduce((sum, s) => sum + s.duration, 0);
    let elapsed = 0;

    for (const step of steps) {
        onStep(step.label, (elapsed / totalDuration) * 100);
        await delay(step.duration);
        elapsed += step.duration;
    }
    onStep('Complete!', 100);
    return getRandomPrediction();
}

/**
 * Simulate model training with epoch-by-epoch output.
 */
export async function simulateTraining(
    onOutput: (line: string) => void,
    epochs = 5
): Promise<void> {
    onOutput('Loading dataset...');
    await delay(600);
    onOutput('Preprocessing data (18,000 samples)...');
    await delay(800);
    onOutput('Initializing model: InvoiceExtractor-v4');
    await delay(400);
    onOutput(`Starting training (${epochs} epochs)...\n`);
    await delay(300);

    let acc = 85.0;
    let loss = 0.35;
    for (let e = 1; e <= epochs; e++) {
        await delay(700);
        loss = Math.max(0.05, loss - (0.04 + Math.random() * 0.03));
        acc = Math.min(96.5, acc + (1.2 + Math.random() * 0.8));
        onOutput(
            `  Epoch ${e}/${epochs} | loss: ${loss.toFixed(4)} | ` +
            `acc: ${acc.toFixed(1)}% | lr: ${(3e-4 * Math.pow(0.9, e)).toExponential(2)}`
        );
    }

    await delay(400);
    onOutput(`\nTraining complete!`);
    onOutput(`Final Accuracy: ${acc.toFixed(1)}%`);
    onOutput(`Model saved to /ai_lab/model_v4.pth`);
}

export function getModelInfo(): string {
    return [
        '╔═══════════════════════════════════════╗',
        '║  MODEL: InvoiceExtractor-v3           ║',
        '╚═══════════════════════════════════════╝',
        '',
        '  Framework:    PyTorch 2.1',
        '  Architecture: ResNet-50 + LSTM decoder',
        '  Parameters:   25.6M',
        '  Dataset:      18,000 invoice images',
        '  Input Size:   640×480',
        '',
        '  Metrics:',
        '    Accuracy:  94.2%',
        '    Precision: 92.7%',
        '    Recall:    95.1%',
        '    F1-Score:  93.9%',
        '',
        '  Status: Ready for inference',
    ].join('\n');
}

function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}
