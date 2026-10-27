import type { APIRoute, GetStaticPaths } from 'astro';
import { calculators, type CalculatorInfo } from '../../data/calculators';
import { calculatorMarkdown } from '../../lib/seo/markdown';

export const getStaticPaths = (() =>
  calculators.map((calculator) => ({
    params: { slug: calculator.slug },
    props: { calculator },
  }))) satisfies GetStaticPaths;

export const GET: APIRoute<{ calculator: CalculatorInfo }> = ({ props }) =>
  new Response(calculatorMarkdown(props.calculator), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
