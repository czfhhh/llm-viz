import { Vec3 } from "@/src/utils/vector";
import { Phase } from "./Walkthrough";
import { commentary, IWalkthroughArgs, setInitialCamera } from "./WalkthroughTools";

export function walkthrough09_Output(args: IWalkthroughArgs) {
    let { walkthrough: wt, state } = args;

    if (wt.phase !== Phase.Input_Detail_Output) {
        return;
    }

    setInitialCamera(state, new Vec3(-20.203, 0.000, -1642.819), new Vec3(281.600, -7.900, 2.298));

    let c0 = commentary(wt, null, 0)`

最后，我们来到了模型的终点。最后一个 Transformer 块的输出经过层归一化，然后我们使用一个线性变换（矩阵乘法），这次没有偏置。

这个最终的变换将每个列向量从长度 C 转换为长度 nvocab。因此，它实际上为每个列生成了词汇表中每个词的得分。这些得分有一个特殊的名字：logits。

"logits"这个名字来源于"log-odds"，即每个 token 的几率的对数。之所以用"log"，是因为我们接下来应用的 softmax 会做指数运算，将其转换为"几率"或概率。

要将这些得分转换为合适的概率，我们通过 softmax 操作处理它们。现在，对于每一列，我们有了模型为词汇表中每个词分配的概率。

在这个特定的模型中，它已经有效地学会了如何排序三个字母的所有答案，因此概率高度集中在正确答案上。

当我们按时间步逐步运行模型时，我们使用最后一列的概率来决定要添加到序列中的下一个 token。例如，如果我们向模型提供了六个 token，我们将使用第 6 列的输出概率。

这一列的输出是一系列概率，我们需要从中选择一个作为序列中的下一个。我们通过"从分布中采样"来实现。也就是说，我们根据概率加权随机选择一个 token。例如，概率为 0.9 的 token 将有 90% 的概率被选中。

当然还有其他选择方式，比如总是选择概率最高的 token。

我们还可以通过使用温度参数来控制分布的"平滑度"。较高的温度会使分布更均匀，较低的温度会使分布更集中在概率最高的 token 上。

我们通过在应用 softmax 之前将 logits（线性变换的输出）除以温度来实现这一点。由于 softmax 中的指数运算对较大的数值有更大的影响，使它们更接近会减小这种效果。
`;

}
