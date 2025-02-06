# Contributing to Calculative

Thank you for considering contributing to [Your Project Name]! We welcome contributions from the community and appreciate your help in improving our project. Please take a moment to read through this guide to make the process smooth for everyone.

## Getting Started

1. **Fork the Repository**: Fork the repository on GitHub and clone your fork to your local machine.

    ```bash
    git clone https://github.com/lakwli/calculative.git
    cd calculative
    ```

2. **Install Dependencies**: Install the necessary dependencies for the project.

    ```bash
    npm install
    ```

3. **Syncfusion License Key**: Obtain your own Syncfusion Community License key. You can apply for a free Community License on the [Syncfusion website](https://www.syncfusion.com/products/communitylicense).

4. **Set Up Environment Variables**: Create a `.env` file in the root of the calculative-web subproject and add your Syncfusion license key.

    ```text
    VITE_SYNCFUSION_LICENSE_KEY=your_generated_license_key_here
    ```

    **Note**: Ensure your `.env` file is added to `.gitignore` to prevent it from being committed to the repository.

    ```text
    # .gitignore
    .env
    ```

## Making Changes

1. **Create a Branch**: Create a new branch for your feature or bug fix.

    ```bash
    git checkout -b feature-name
    ```

2. **Make Your Changes**: Implement your feature or bug fix in the new branch.

3. **Test Your Changes**: Ensure that your changes pass all tests and do not break existing functionality.

    ```bash
    npm test
    ```

4. **Commit Your Changes**: Commit your changes with a clear and descriptive commit message. Also, ensure that you sign off your commits to comply with the Developer Certificate of Origin (DCO).

    ```bash
    git add .
    git commit -s -m "Add feature-name: Description of your changes"
    ```

5. **Push Your Changes**: Push your changes to your forked repository.

    ```bash
    git push origin feature-name
    ```

6. **Create a Pull Request**: Open a pull request on GitHub from your branch to the main repository's `main` branch. Provide a detailed description of your changes and any related issues.

## Code of Conduct

Please note that we have a [Code of Conduct](CODE_OF_CONDUCT.md) in place. By participating in this project, you agree to abide by its terms.

## License

By contributing to [Calculative], you agree that your contributions will be licensed under the same license as the project.

## Developer Certificate of Origin (DCO)

This project uses the [Developer Certificate of Origin (DCO)](https://developercertificate.org/). By contributing to this project, you agree to the DCO. To indicate your compliance, add a 'Signed-off-by' line to your commit messages.

To sign your commits, use the `-s` or `--signoff` flag when making a commit:
```bash
git commit -s -m "Your commit message"



By making these changes, you ensure that contributors are aware of the DCO requirement and know how to sign their commits properly. This helps maintain legal compliance and transparency in your open source project.

If you have any more questions or need further assistance, feel free to ask! 🚀