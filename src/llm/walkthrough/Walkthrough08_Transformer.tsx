import { Vec3 } from "@/src/utils/vector";
import { Phase } from "./Walkthrough";
import { commentary, IWalkthroughArgs, setInitialCamera } from "./WalkthroughTools";

export function walkthrough08_Transformer(args: IWalkthroughArgs) {
    let { walkthrough: wt, state } = args;

    if (wt.phase !== Phase.Input_Detail_Transformer) {
        return;
    }

    setInitialCamera(state, new Vec3(-135.531, 0.000, -353.905), new Vec3(291.100, 13.600, 5.706));

    let c0 = commentary(wt, null, 0)`

以上就是完整的 Transformer 块！

这些块构成了任何 GPT 模型的主体，并且被重复多次，一个块的输出馈入下一个块，延续残差路径。

正如深度学习中的常见情况，很难确切地说清每一层在做什么，但我们有一些大致的认识：较早的层倾向于学习低层特征和模式，而较晚的层则学习识别和理解更高层次的抽象和关系。在自然语言处理的背景下，较低的层可能学习语法、句法和简单的词语关联，而较高的层可能捕捉更复杂的语义关系、话语结构和上下文相关的含义。

`;

}
