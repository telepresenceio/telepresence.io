import { Plugin } from "@docusaurus/types";
import { RuleSetRule } from "webpack";
import { Config as SvgrConfig } from "@svgr/core";
import logger from '@docusaurus/logger'

/**
 * Docusaurus uses SVGR internally, which in turn uses SVGO. This alters the
 * SVGO config and merges the changes back into Docusaurus' webpack config.
 *
 * @returns {Plugin}
 */
function configureSvgo(): Plugin {
	return {
		name: 'configure-svgo',
		configureWebpack(config) {
			const rules = config.module.rules
			const svgRule = rules?.find(r =>
				(r as { test: RegExp }).test.test("file.svg"),
			) as RuleSetRule | undefined;
			if (!svgRule) {
				logger.warn("Failed to apply SVG fix, could not find SVG rule in webpack config!");
				return {};
			}
			const svgrLoader = svgRule.oneOf?.find(
				r =>
					((r as RuleSetRule).use as object[] | undefined)?.length === 1 &&
					((r as RuleSetRule).use as { loader: string }[])?.[0].loader.includes(
						"@svgr/webpack",
					),
			);
			if (!svgrLoader) {
				logger.warn(
					"Failed to apply SVG fix, could not find svgr loader in webpack config!",
				);
				return {};
			}

			const svgrConfig = (svgrLoader.use as { options: SvgrConfig }[])[0].options
			if (!svgrConfig) {
				logger.warn(
					"Failed to apply SVG fix, could not find svgo config in webpack config!",
				);
				return {};
			}
			svgrConfig.svgo = false
			logger.info("svgo disabled")
			return {};
		}
	}
}
export default configureSvgo;