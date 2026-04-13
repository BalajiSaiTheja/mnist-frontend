import React, { useEffect, useState } from "react";
import { Terminal, Info, Check, Copy } from "lucide-react";

function Section({ title, children }) {
    return (
        <section className="group py-5 first:pt-0 w-full border-b border-slate-50 last:border-0">
            <div className="flex items-center gap-4 mb-8">
                <div className="h-10 w-1.5 bg-indigo-600 rounded-full" />
                <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
                    {title}
                </h2>
            </div>
            <div className="text-slate-700 leading-relaxed text-sm md:text-sm font-normal space-y-6 text-left md:text-justify [text-justify:inter-word] w-full">
                {children}
            </div>
        </section>
    );
}
function Callout({ title, children }) {
    return (
        <div className="relative my-8 overflow-hidden rounded-2xl border border-amber-200 bg-amber-50/50 p-6 backdrop-blur-sm w-full">
            <div className="flex items-start gap-4">
                <div className="mt-1 rounded-full bg-amber-100 p-2 text-amber-600 shrink-0">
                    <Info size={20} strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-amber-900 mb-2 leading-none">
                        {title}
                    </h3>
                    {/* Justified callout content */}
                    <div className="text-amber-800/90 text-[17px] leading-relaxed text-justify hyphens-auto">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}

function CodeBlock({ code, filename = "vision_model.py" }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="my-8 overflow-hidden rounded-xl border border-slate-800 bg-[#0f172a] shadow-2xl w-full">
            <div className="flex items-center justify-between bg-slate-800/50 px-4 py-2">
                <div className="flex items-center gap-2">
                    <Terminal size={14} className="text-slate-400" />
                    <span className="text-xs font-mono text-slate-400">{filename}</span>
                </div>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
                >
                    {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                    {copied ? "Copied!" : "Copy"}
                </button>
            </div>
            <div className="relative overflow-x-auto p-6">
                <pre className="font-mono text-[15px] leading-relaxed text-indigo-100">
                    <code>{code}</code>
                </pre>
            </div>
        </div>
    );
}
const vitCode = `
class ViT(nn.Module):
    def __init__(self,...):
        super().__init__()
        self.patch = PatchEmbedding(...)
        self.encoder = nn.ModuleList([...])
        self.norm = LayerNorm(...)
        self.head = nn.Linear(...)

    def forward(self,x):
        x = self.patch(x)
        for enc in self.encoder:
            x = enc(x)

        x = self.norm(x)
        x = x[:, 0]   # CLS token
        return self.head(x)
`;


function Blog() {

    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    const progress = Math.min(scrollY / 150, 1);
    const translateX = (1 - progress) * -10;
    const opacity = progress > 0.1 ? 1 : 0.4;
    return (
        <article className="max-w-3xl lg:max-w-4xl mx-auto px-6 font-sans">
            <div className="relative">

                <section className="sticky top-0 z-30 bg-white/95 backdrop-blur-md py-4 border-b border-slate-200 transition-all duration-300 mb-5">
                    <div className="relative flex items-center h-10 w-full justify-center overflow-hidden">
                        <h1
                            className="text-3xl font-black text-indigo-600 tracking-tight"
                            style={{
                                transform: `translateX(${translateX}%)`,
                                opacity: opacity,
                            }}
                        >
                            Vision Transformer (ViT) <span className="text-slate-900">on MNIST</span>
                        </h1>
                    </div>
                </section>

                <div className="space-y-12">

                    <Section title="What is ViT?">
                        <div className="space-y-4">
                            <p>
                                The <strong>Vision Transformer (ViT)</strong> represents a departure from the traditional
                                Convolutional Neural Network (CNN) paradigm. While CNNs rely on <em>spatial inductive biases</em>
                                (locality and translation invariance) through sliding kernels, ViT treats images as a
                                sequence of discrete visual tokens.
                            </p>
                            <p>
                                By decomposing a 2D image into 1D <strong>flattened patches</strong>, the model utilizes
                                Multi-Head Self-Attention (MHSA) to establish long-range dependencies across the entire
                                input space. This enables a <strong>global receptive field</strong> starting from the
                                very first layer, allowing the model to capture complex structural relationships that
                                local convolutions often miss.
                            </p>
                        </div>
                    </Section>

                    <Section title="Why ViT for MNIST?">
                        <div className="space-y-4">
                            <p>
                                Applying a Vision Transformer to MNIST serves as a compelling case study in
                                <strong> Global Context Modeling</strong>. While traditional Convolutional Neural
                                Networks (CNNs) are architecturally biased toward local features via small kernels,
                                they often require multiple layers to aggregate a "whole-digit" perspective.
                            </p>
                            <p>
                                In contrast, ViT utilizes the <strong>Self-Attention mechanism</strong> to bypass these
                                spatial constraints. By treating the digit as a sequence of patches, the model can
                                directly correlate distant strokes—such as the parallel lines of a '4' or the closure
                                of a '0'—in the very first layer. This demonstrates that <strong>relational learning</strong>
                                can be just as effective as localized feature extraction, even on small-scale datasets.
                            </p>
                        </div>
                    </Section>

                    <Section title="Architecture Overview">
                        <div className="space-y-4">
                            <p>
                                The core of this implementation is a <strong>Vision Transformer (ViT)</strong> built entirely
                                from fundamental PyTorch primitives. The architecture processes images through a
                                strictly sequential pipeline designed to extract global features without convolutional kernels.
                            </p>

                            <ul className="list-decimal list-inside space-y-3 text-md text-slate-600">
                                <li>
                                    <strong>Patch Embedding & Tokenization:</strong> The 28&times;28 image is unfolded
                                    into 7&times;7 patches. Each patch is flattened and linearly projected into a
                                    512-dimensional latent space. A learnable  <strong> CLS (Classification) token</strong>
                                    is prepended to this sequence.
                                </li>

                                <li>
                                    <strong>Sinusoidal Positional Encoding:</strong> To maintain spatial order, we inject
                                    fixed geometric embeddings using sine and cosine functions. This allows the
                                    Transformer to differentiate between a stroke at the top vs. the bottom of the digit.
                                </li>
                                <li>
                                    <strong>Transformer Encoder Stack:</strong> The data passes through 4 Encoder blocks.
                                    Each block performs <strong>Multi-Head Self-Attention (8 heads)</strong> followed by a
                                    Feed-Forward MLP, utilizing <strong>Residual Connections</strong> and custom
                                    <strong>Layer Normalization</strong> to ensure numerical stability.
                                </li>

                                <li>
                                    <strong>Latent Representation Extraction:</strong> Post-encoding, we isolate the
                                    vector at index 0 (the CLS token). This vector acts as a global summary of the
                                    image, which is then mapped to 10 class logits via an MLP head.
                                </li>
                            </ul>
                        </div>
                    </Section>

                    <Section title="Tensor Shape Flow">
                        <div className="grid grid-cols-1 gap-4 font-mono text-sm">
                            <div className="flex flex-col p-4 bg-slate-50 border border-slate-200 rounded-xl transition-all hover:border-indigo-300 group">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-slate-500 font-bold uppercase tracking-tighter">Input Batch</span>
                                    <span className="text-indigo-600 font-bold">(64, 1, 28, 28)</span>
                                </div>
                                <p className="text-slate-500 text-sm italic">Raw MNIST grayscale images [Batch, Channels, H, W].</p>
                            </div>

                            <div className="flex flex-col p-4 bg-slate-50 border border-slate-200 rounded-xl">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-slate-500 font-bold uppercase tracking-tighter">Linear Patching</span>
                                    <span className="text-indigo-600 font-bold">(64, 16, 49)</span>
                                </div>
                                <p className="text-slate-500 text-sm italic">Unfolded into 16 patches of size 7&times;7.</p>
                            </div>

                            <div className="flex flex-col p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-slate-500 font-bold uppercase tracking-tighter">Latent Embedding</span>
                                    <span className="text-indigo-600 font-bold">(64, 16, 512)</span>
                                </div>
                                <p className="text-slate-500 text-sm italic">Projected to a 512-dimensional hidden vector.</p>
                            </div>

                            <div className="flex flex-col p-4 bg-slate-50 border border-slate-200 rounded-xl">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-slate-500 font-bold uppercase tracking-tighter">Sequence + CLS</span>
                                    <span className="text-indigo-600 font-bold">(64, 17, 512)</span>
                                </div>
                                <p className="text-slate-500 text-sm italic">Prepended learnable [CLS] token for global aggregation.</p>
                            </div>

                            <div className="flex flex-col p-4 bg-slate-900 border border-slate-800 rounded-xl">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-slate-300 font-bold uppercase tracking-tighter">Encoder Output</span>
                                    <span className="text-green-400 font-bold">(64, 17, 512)</span>
                                </div>
                                <p className="text-slate-500 text-sm italic">Post-Self-Attention: Every token has global spatial context.</p>
                            </div>

                            <div className="flex flex-col p-4 bg-slate-50 border border-slate-200 rounded-xl">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-slate-500 font-bold uppercase tracking-tighter">Prediction Logits</span>
                                    <span className="text-indigo-600 font-bold">(64, 10)</span>
                                </div>
                                <p className="text-slate-500 text-sm italic">Isolated CLS token mapped to final digit probabilities.</p>
                            </div>
                        </div>
                    </Section>

                    <Section title="Implementation (PyTorch)">
                        <div className="space-y-6">
                            <p>
                                Implementing a Vision Transformer from scratch requires careful handling of high-dimensional
                                tensor permutations. The architecture is built on three pillars of modularity:
                            </p>

                            {/* Pillar 1: Patching */}
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <h4 className="text-[14px] font-bold text-indigo-600 mb-2">1. Memory-Efficient Patching</h4>
                                    <p className="text-[14px] text-slate-600 leading-relaxed">
                                        Instead of using expensive <code>for-loops</code> or <code>crop</code> operations,
                                        we utilize the <code>.unfold()</code> method. This allows us to partition the 4D image
                                        tensor into patches directly within the GPU's memory space, drastically reducing
                                        the overhead of the embedding layer.
                                    </p>
                                </div>

                                {/* Pillar 2: Self-Attention */}
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <h4 className="text-sm font-bold text-indigo-600 mb-2">2. Scaled Dot-Product Attention</h4>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        Our Multi-Head Attention (MHA) implementation manually manages <strong>Query, Key,
                                            and Value</strong> projections. By scaling the dot product by <code>√(d_k)</code>, we
                                        prevent gradients from vanishing during the Softmax phase, ensuring stable training
                                        even with high-dimensional embeddings (DIM=512).
                                    </p>
                                </div>
                            </div>

                            {/* Pillar 3: Normalization */}
                            <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-200">
                                <h4 className="text-sm font-bold text-slate-900 mb-1">Architectural Decision: Pre-Norm vs. Post-Norm</h4>
                                <p className="text-sm text-slate-600 leading-relaxed italic">
                                    "In this implementation, we adopted the <strong>Pre-Norm</strong> convention. By applying
                                    Layer Normalization <em>before</em> the attention and MLP blocks, we create a 'clean'
                                    residual path that allows gradients to flow through the 4 encoder blocks without
                                    significant degradation."
                                </p>
                            </div>

                            {/* Code Accordion */}
                            <details className="group cursor-pointer border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                                <summary className="flex items-center justify-between font-semibold p-4 bg-white hover:bg-slate-50 transition-colors">
                                    <span className="flex items-center gap-2 text-slate-900">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        Production-Ready PyTorch Source
                                    </span>
                                    <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
                                </summary>
                                <div className="border-t border-slate-200">
                                    <CodeBlock code={vitCode} />
                                </div>
                            </details>
                        </div>
                    </Section>

                    <section className="bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-inner">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-2 h-6 bg-indigo-500 rounded-full" />
                            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                                Hyperparameter Configuration
                            </h3>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {/* Patch Size */}
                            <div className="space-y-1">
                                <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Patch Size</p>
                                <p className="text-lg font-mono font-bold text-indigo-600">4 &times; 4</p>
                                <p className="text-[10px] text-slate-500">49 tokens / image</p>
                            </div>

                            {/* Embedding Dimension */}
                            <div className="space-y-1">
                                <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Latent Dim (D)</p>
                                <p className="text-lg font-mono font-bold text-indigo-600">128</p>
                                <p className="text-[10px] text-slate-500">Balance of capacity & speed</p>
                            </div>

                            {/* Attention Heads */}
                            <div className="space-y-1">
                                <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Attn Heads</p>
                                <p className="text-lg font-mono font-bold text-indigo-600">8</p>
                                <p className="text-[10px] text-slate-500">16-dim per head <code>d_k</code></p>
                            </div>

                            {/* Optimization */}
                            <div className="space-y-1">
                                <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Optimizer</p>
                                <p className="text-sm font-bold text-slate-800">AdamW</p>
                                <p className="text-[10px] text-slate-500">w/ Cosine Annealing</p>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-200/60">
                            <p className="text-sm text-slate-500 leading-relaxed italic">
                                <strong>Note:</strong> We utilized a relatively small embedding dimension (D=128) to prevent
                                overfitting on the MNIST manifold, while maintaining 8 attention heads to ensure the model
                                could attend to diverse geometric features (loops, intersections, and terminals) simultaneously.
                            </p>
                        </div>
                    </section>

                </div>
            </div>
        </article>
    );
}

export default Blog;