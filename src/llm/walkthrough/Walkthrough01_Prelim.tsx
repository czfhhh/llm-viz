import React from 'react';
import { Phase } from "./Walkthrough";
import { commentary, embed, IWalkthroughArgs, setInitialCamera } from "./WalkthroughTools";
import s from './Walkthrough.module.scss';
import { Vec3 } from '@/src/utils/vector';

let minGptLink = 'https://github.com/karpathy/minGPT';
let pytorchLink = 'https://pytorch.org/';
let andrejLink = 'https://karpathy.ai/';
let zeroToHeroLink = 'https://karpathy.ai/zero-to-hero.html';

export function walkthrough01_Prelim(args: IWalkthroughArgs) {
    let { state, walkthrough: wt } = args;

    if (wt.phase !== Phase.Intro_Prelim) {
        return;
    }

    setInitialCamera(state, new Vec3(184.744, 0.000, -636.820), new Vec3(296.000, 16.000, 13.500));

    let c0 = commentary(wt, null, 0)`
在我们深入算法的细节之前，让我们先退一步，简单了解一下背景。

本指南专注于 _推理_（inference），而非训练，因此它只是整个机器学习过程中的一小部分。
在我们的场景中，模型的权重已经预先训练好，我们使用推理过程来生成输出。这个过程直接在浏览器中运行。

这里展示的模型属于 GPT（生成式预训练 Transformer）家族，可以描述为一种"基于上下文的 token 预测器"。
OpenAI 在 2018 年引入了这个模型家族，代表性的成员包括 GPT-2、GPT-3 和 GPT-3.5 Turbo，后者是广泛使用的 ChatGPT 的基础。
它也可能与 GPT-4 有关，但具体细节尚未公开。

本指南的灵感来源于 ${embedLink('minGPT', minGptLink)} GitHub 项目，这是一个由 ${embedLink('Andrej Karpathy', andrejLink)} 用 ${embedLink('PyTorch', pytorchLink)} 实现的最小化 GPT。
他的 YouTube 系列 ${embedLink("Neural Networks: Zero to Hero", zeroToHeroLink)} 和 minGPT 项目是创建本指南的宝贵资源。
这里展示的 toy 模型就基于 minGPT 项目中的一个示例。

好了，让我们开始吧！
`;

}

export function embedLink(a: React.ReactNode, href: string) {
    return embedInline(<a className={s.externalLink} href={href} target="_blank" rel="noopener noreferrer">{a}</a>);
}

export function embedInline(a: React.ReactNode) {
    return { insertInline: a };
}


// Another similar model is BERT (bidirectional encoder representations from transformers), a "context-aware text encoder" commonly
// used for tasks like document classification and search.  Newer models like Facebook's LLaMA (large language model architecture), continue to use
// a similar transformer architecture, albeit with some minor differences.
