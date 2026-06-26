import { Vec3 } from "@/src/utils/vector";
import { Phase } from "./Walkthrough";
import { commentary, DimStyle, IWalkthroughArgs, moveCameraTo, setInitialCamera } from "./WalkthroughTools";
import { lerp, lerpSmoothstep } from "@/src/utils/math";
import { processUpTo, startProcessBefore } from "./Walkthrough00_Intro";

export function walkthrough06_Projection(args: IWalkthroughArgs) {
    let { walkthrough: wt, state, layout, tools: { breakAfter, afterTime, c_blockRef, c_dimRef, cleanup } } = args;

    if (wt.phase !== Phase.Input_Detail_Projection) {
        return;
    }

    setInitialCamera(state, new Vec3(-73.167, 0.000, -270.725), new Vec3(293.606, 2.613, 1.366));
    let block = layout.blocks[0];
    wt.dimHighlightBlocks = [...block.heads.map(h => h.vOutBlock), block.projBias, block.projWeight, block.attnOut];

    let outBlocks = block.heads.map(h => h.vOutBlock);

    commentary(wt, null, 0)`

自注意力过程结束后，我们得到了每个头的输出。这些输出是经过适当混合的 V 向量，受 Q 和 K 向量的影响。

为了合并每个头的 ${c_blockRef('输出向量', outBlocks)}，我们简单地将它们堆叠在一起。因此，对于时间
${c_dimRef('t = 4', DimStyle.T)}，我们从 3 个长度为 ${c_dimRef('A = 16', DimStyle.A)} 的向量变为 1 个长度为 ${c_dimRef('C = 48', DimStyle.C)} 的向量。`;

    breakAfter();

    let t_fadeOut = afterTime(null, 1.0, 0.5);
    // let t_zoomToStack = afterTime(null, 1.0);
    let t_stack = afterTime(null, 1.0);

    breakAfter();

    commentary(wt)`

值得注意的是，在 GPT 中，一个头内向量的长度(${c_dimRef('A = 16', DimStyle.A)})等于 ${c_dimRef('C', DimStyle.C)} / 头数。这确保了当我们把它们堆叠回去时，能得到原始长度 ${c_dimRef('C', DimStyle.C)}。

从这里开始，我们执行投影以获得该层的输出。这是一个简单的逐列矩阵-向量乘法，并加上偏置。`;

    breakAfter();

    let t_process = afterTime(null, 3.0);

    breakAfter();

    commentary(wt)`

现在我们有了自注意力层的输出。不是直接将这个输出传递给下一阶段，而是将其逐元素加到输入嵌入上。这个过程，由绿色垂直箭头表示，被称为 _残差连接_（residual connection）或 _残差路径_。
`;

    breakAfter();

    let t_zoomOut = afterTime(null, 1.0, 0.5);
    let t_processResid = afterTime(null, 3.0);

    cleanup(t_zoomOut, [t_fadeOut, t_stack]);

    breakAfter();

    commentary(wt)`

与层归一化一样，残差路径对于深度神经网络中的有效学习至关重要。

现在有了自注意力的结果，我们可以将其传递给 Transformer 的下一个部分：前馈网络。
`;

    breakAfter();

    if (t_fadeOut.active) {
        for (let head of block.heads) {
            for (let blk of head.cubes) {
                if (blk !== head.vOutBlock) {
                    blk.opacity = lerpSmoothstep(1, 0, t_fadeOut.t);
                }
            }
        }
    }

    if (t_stack.active) {
        let targetZ = block.attnOut.z;
        for (let headIdx = 0; headIdx < block.heads.length; headIdx++) {
            let head = block.heads[headIdx];
            let targetY = head.vOutBlock.y + head.vOutBlock.dy * (headIdx - block.heads.length + 1);
            head.vOutBlock.y = lerp(head.vOutBlock.y, targetY, t_stack.t);
            head.vOutBlock.z = lerp(head.vOutBlock.z, targetZ, t_stack.t);
        }
    }

    let processInfo = startProcessBefore(state, block.attnOut);

    if (t_process.active) {
        processUpTo(state, t_process, block.attnOut, processInfo);
    }

    moveCameraTo(state, t_zoomOut, new Vec3(-8.304, 0.000, -175.482), new Vec3(293.606, 2.623, 2.618));

    if (t_processResid.active) {
        processUpTo(state, t_processResid, block.attnResidual, processInfo);
    }
}
