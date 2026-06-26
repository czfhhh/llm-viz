import { Vec3 } from "@/src/utils/vector";
import { Phase } from "./Walkthrough";
import { commentary, IWalkthroughArgs, setInitialCamera } from "./WalkthroughTools";

export function walkthrough05_Softmax(args: IWalkthroughArgs) {
    let { walkthrough: wt, state } = args;

    if (wt.phase !== Phase.Input_Detail_Softmax) {
        return;
    }

    setInitialCamera(state, new Vec3(-24.350, 0.000, -1702.195), new Vec3(283.100, 0.600, 1.556));

    let c0 = commentary(wt, null, 0)`

Softmax 操作用于自注意力（如上一节所示），也会出现在模型的最后。

它的目标是取一个向量并对其值进行归一化，使它们之和为 1.0。然而，它并不是简单地将每个值除以总和。相反，每个输入值会先被取指数。

  a = exp(x_1)

这会使所有值变为正数。一旦我们有了取指数后的向量，就可以将每个值除以所有值的总和。这确保了所有值之和为 1.0。由于所有取指数后的值都是正数，我们知道结果值将在 0.0 到 1.0 之间，这提供了原始值上的概率分布。

Softmax 就这些：简单地取指数，然后除以总和。

不过有一个小问题。如果某个输入值很大，那么取指数后的值将非常大。我们最终会用一个大数除以一个非常大的数，这可能导致浮点运算问题。

Softmax 的一个有用性质是：如果我们给所有输入值加上一个常数，结果不会改变。因此我们可以找到输入向量中的最大值，并从所有值中减去它。这确保了最大值变为 0.0，从而使 softmax 保持数值稳定。

让我们在自注意力层的背景下来看 softmax 操作。每个 softmax 操作的输入向量是自注意力矩阵的一行（但只到对角线为止）。

与层归一化类似，我们有一个中间步骤，存储一些聚合值以保持过程高效。

对于每一行，我们存储该行的最大值以及平移并取指数后的值的总和。然后，要生成对应的输出行，我们可以执行一组简单的操作：减去最大值、取指数、除以总和。

为什么叫"softmax"？这个操作的"硬"版本叫做 argmax，它简单地找到最大值，将其设为 1.0，并将所有其他值设为 0.0。相比之下，softmax 操作是其"软"化版本。由于 softmax 中涉及指数运算，最大值会被强调并推向 1.0，同时仍然保持所有输入值上的概率分布。这使得它能够更细致地表示不仅是最可能的选项，还包括其他选项的相对可能性。
`;

}
