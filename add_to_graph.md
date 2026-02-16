*https://www.datacamp.com/tutorial/how-transformers-work*

-les multi head attention sont *stackées* 6 dans le papier original, ce qui engendre la profondeur

- *sqrt(dk*) to normalize QK 
=> Variance = var sum_i = 1to_dk Q_iK_i prop to dk 
=> divide by sqrt(dk) to have variance1 => scale the value, softmax less diracstyle


nn.LayerNorm(d_model) normalise chaque vecteur de dimension d_model individuellement :

*Layer norm* Impact :
Les valeurs de chaque dimension ont moyenne 0 et variance 1 → plus facile pour le modèle d’apprendre.
Stabilise l’entraînement → les gradients explosent moins, converge plus vite.
Rend le réseau moins sensible à l’échelle des entrées.

C’est *différent de BatchNorm*, qui normalise sur le batch entier ; *LayerNorm* normalise par vecteur d’entrée, ce qui est mieux pour les séquences variables.
Pre Layer Norm for gradient identite inr esidual connnection


*How Mixed Precision Works in Training*
*Step A: Forward Pass*
- Compute activations using FP16. Some layers (like BatchNorm) may stay in FP32 to avoid numerical instability.
Store activations in FP16 (less memory used).
*Step B: Backward Pass*
-Compute gradients in FP16.
-Sometimes gradients can underflow (become 0) due to low precision → solved using loss scaling. *Loss Scaling* Multiply the loss by a large constant (e.g., 1024).
*Compute gradients* → avoids underflow in FP16.
Divide gradients by the same constant before updating weights.
This ensures tiny gradient values aren’t lost due to FP16’s limited
precision.
*Step C: Weight Update*
Keep the **master copy of weights in FP32.*
Use FP32 weights for updates (so they’re accurate).
Convert FP32 weights to FP16 for forward/backward passes.
This is called “FP16 compute, FP32 weights” strategy.

Ex : Poids master FP32 : 0.12345678
Gradient FP16 : 0.0001 (limite de précision FP16)
learing rate peut overflow et rien ne se passe en FP16
mais si on passe en FP32 pas d'overfloxw en multipliant par le learning rate-> ça amrche[text](https://medium.com/%40joaolages/kv-caching-explained-276520203249)

*Quantization*
Quantization is the process of converting continuous or high-precision data into a finite, discrete set of values, essentially mapping a large range to smaller "buckets,"


*context window*
one could think that the context window is just enlarged with enlarging the Length of the entry sequence possible
and thus Q,K, V  dim L x dim(proj) mais crest pas le cas.

https://huggingface.co/blog/not-lain/kv-caching
https://medium.com/@joaolages/kv-caching-explained-276520203249
*Ktv* cache en inference causale KtV (token précédent est réutilisé pour conforntation à la nouvelle query) -> on le met en cache
Query du nouveau token 


*Can the Input Sentence Be Infinite?*
No, the input size cannot be infinite in practice. Here’s why:

Memory constraints: The O(n2)O(n^2)O(n2) memory requirement for the attention matrix makes it impractical for very long sequences (e.g., beyond a few thousand tokens on most hardware).

Computational limits: Even if memory were unlimited, the time to compute QKTQK^TQKT would grow exponentially with sequence length.
Workarounds:

*Sliding window attention*: Restrict attention to a local window (e.g., only attend to the previous 512 tokens).
*Sparse attention patterns*: Use fixed or learned sparse attention patterns to reduce the number of computations.
*Linear attention approximations*: Approximate the softmax operationto reduce complexity to O(n)O(n)O(n) (e.g., using kernel methods or low-rank approximations).
*Memory-compressed attention*: Techniques like Linformer, Reformer, or Performer reduce the quadratic cost.
State space models (e.g., S4, H3): These are designed to handle very long sequences efficiently.

*poids d'inférence différent de memoire poids d'netrainement*
Memoire poirds = N param * 4  (32 bits = 4 octets)
Poids + activation + KV en inférence en mémoire
entrainement : poids gradient etats optimieur activation..

*Quantization*
Post-Training Quantization (PTQ)
This is quantization on LLM after it has been trained.
Quantization-Aware Training (QAT)
This is a method of fine tuning on data so that quantization can be acheived easily. This includes weight conversion process such as calibration, range estimation, clipping, rounding etc. during the training. These method are computationally intensive. There is no need for callibration after the QAT process as the model is callibrated during the training. This process results in much better model accuracy and performa
Why Quantization
Advantages:
- Lesser memory consumption: Lower bit width results in less memory for storage
- Fast Inference: This is due to efficient computation due to its - lower memory bandwidth requirements
- Less energy consumption: Larger model need more data movement and storage resulting in more energy consumption. Hence a smaller model results in compartively lesser energy usage.
- Smaller models: Can quantize to suit the need and deploy to device with samller hadware specifications.


*FLOP* = number of Floating point Operations

*Communication overhead* = time + bandwidth cost of moving tensors between devices instead of computing on them
dominate FLOP at scale, when the number of layers rise.
What communicate  = Gradients of model parameters (compute in aprallel for each head) but had to be transferred.
unavoidable communication  when we project the output caoncatenated from all the head...


*sparse attention*
-flash attention*
https://huggingface.co/docs/text-generation-inference/en/conceptual/flash_attentionFlash Attention loads keys, queries, and values once, fuses the operations of the attention mechanism, and writes them back.

Do all tokens really have to attend to all other tokens?
Why not compute attention only over important tokens?
How to decide what tokens are important?
How to attend to just a few tokens in a very efficient way?

beau blog = woindow atetion, global attention, random atention*https://huggingface.co/blog/big-bird*


**Failure modes**
OOM is a memory capacity problem. Even if computation per step is low, the model may not fit in device memory.
Attention bottleneck / latency is a compute problem. The model fits in memory, but the time to compute QKᵀ, softmax, and weighted V is too long.

You can have high latency without OOM if your device can store everything but the quadratic attention is slow.
Conversely, you can have OOM even with a small sequence, if the model is extremely large and activation/weights cannot fit.
Numerical instability saturation , multiple layers gradient NA with fP16 -> layer norm etc..

Activation are all the intermediate results from a neural network, had to be kept in memory  since  needed for the backoprop

*Throughput* = number of input tokens processed per second (or per millisecond, depending on scale).
Higher throughput means the model can handle more data in a given time, which is crucial for large-scale inference or training.

*Paralellism*

- Tensor Parallelism (TP)

What it is: Splits individual layers (matrix multiplications) across multiple GPUs; e.g., each GPU computes a slice of the weight matrix.
Memory impact: Each GPU stores only a fraction of the parameters; activations may need all-reduce.
Latency / throughput: Extra inter-GPU communication per forward/backward pass increases latency; good throughput if communication is efficient.
Use case: Needed when a single GPU cannot fit all weights of a layer.

- Pipeline Parallelism (PP)
What it is: Splits the model layers into sequential stages across GPUs; mini-batches flow through the pipeline.
Memory impact: Each GPU holds only a subset of layers.
Latency / throughput: Latency can be high at the start of the pipeline; throughput improves with micro-batching and “pipeline bubbles” scheduling.
Use case: Layer-parallelism needed for extremely deep models.

- Sharded / Data Parallelism (DP)
What it is: Each GPU has a replica of the model; gradients are averaged across devices.
Memory impact: Full model per GPU (unless combined with ZeRO or other optimizer sharding).
Latency / throughput: Scales throughput linearly with batch size; communication overhead during gradient reduction.
Use case: Training large datasets efficiently; often combined with TP/PP.


*Observbility*
1. Performance Metrics (beyond BLEU/perplexity):

Likelihood-based metrics: Log-likelihood, surprisal per token to detect distributional drift.
Task-specific metrics: Accuracy/F1 for structured tasks, ROUGE/BLEU for summarization/translation.
Diversity/entropy metrics: Token-level entropy or repetition rates to detect degeneration.
Latency & throughput: Measure end-to-end response times to detect infrastructure bottlenecks.

2. Observability signals for hallucinations, bias, or degradation:

Semantic consistency checks: Cross-compare outputs with retrieval sources (for RAG systems).
Fact-checking scores: Use automated models to detect hallucinated entities or numbers.
Toxicity / safety detectors: Detect offensive or biased outputs (Perspective API, or in-house classifiers).
User feedback / human-in-the-loop: Voting, thumbs-up/down, or corrections. Aggregate to detect persistent failure modes.
Data drift / distribution shift: Monitor embedding distributions over time to detect inputs outside training distribution.

3. Production scalability considerations:
Signals should be streamed and aggregated, e.g., Kafka + Spark or Flink pipelines.
Alerts for anomalous metrics (spikes in hallucinations, latency, or repetition).
Periodic audits using sampled human evaluation to calibrate automated metrics.
*Gaussian error linear unit* GELU xphi(x)

*post training* = train tbe agent (instructit) tobe a conversationnal agent, => fine tune on a daaset of conversation

*blue red perplexity*

*RLHF* when we do not ask a fact but we want to score something the answer is not checkable simply -> human judge for example if a joke is funnier than the other different from LLM as a judge

naive approch 1000 updates of network 1000 prompts and 1000 rollout by -> 1000 000 answer to judge
More intelligent  : 1000 prompts, 5 rollout by prompts.
ask hulan toi order the rollouts -> compare to the probability (or reward displayed by the reward model) -> and tune the model according to the human ranking
the reward model take a rollout and  try to mimic the human preference. Elo style (reward model =transformers which ouptu a scor)
RL is runable on arbitrary domains (even the unverifiable ones)
For a human discriminate is far more easier than generate

*througput vs matency*
Latency : temps de réponse d’une requête ou génération d’un token.

P99 latency : le temps de réponse en dessous duquel 99 % des requêtes tombent.

Autrement dit, seules 1 % des requêtes sont plus lentes que ce temps.

C’est un indicateur de performance “au pire”, car la moyenne peut être trompeuse si quelques requêtes sont très lentes.
Gros batch => good throughput (on autorise plusieurs users en paralllele), but latency weak because, all the answer of everyon has to be calculated..


*Batching Strategy*

Dynamic batching: group requests arriving within a short time window
Avoid padding large sequences together (wastes GPU memory)
Trade-off: smaller batch → lower latency, lower throughput; larger batch → higher throughput, higher latency


*How to Detect Memorization*
Exposure Metric (Carlini et al., 2021): fraction of times model outputs n-gram sequences from training corpus
Membership Inference Attacks: test whether specific data points were in training set
High-confidence sequence extraction: generate sequences with temperature=0, beam search


# pour obvserver usage GPU toutes les 0.5 secondes
watch -n 0.5 nvidia-smi
torch.cuda.empty_cahce après un del de l'objet meme effet que le garbage collector (gc ne marche pas pour les objets GPU)
